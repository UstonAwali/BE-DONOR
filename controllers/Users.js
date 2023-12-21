import Users from "../models/UserModel.js"
import bcrypt from "bcrypt"
import path from 'path'
import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer'

export const getUsers = async(req, res) => {
  try {
    const users = await Users.findAll()
    res.json(users)
  } catch (error) {
    console.log(error)
  }
}

export const Register = async(req, res) => {
  const { name, username, email,no_telp, password, confirmPassword } = req.body
  if (password !== confirmPassword) {
    return res.status(400).json({
      msg: 'Password dan Confirm Password Tidak Cocok'
    })
  }

  const user = await Users.findOne({ where: { username } });
  if (user) {
    return res.status(404).json({ msg: 'Username sudah ada! ganti username!' });
  }

  const salt = await bcrypt.genSalt()
  const hashPassword = await bcrypt.hash(password, salt)
  try {
    await Users.create({
      name: name,
      username: username,
      email: email,
      no_telp: no_telp,
      password: hashPassword
    })
    res.json({msg:"Register Berhasil"})
  } catch (error) {
    console.log(error)
  }
}

export const Login = async(req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        username: req.body.username
      }
    })
    const match = await bcrypt.compare(req.body.password, user[0].password)
    if (!match) {
      return res.status(400).json({msg: "Wrong Password"})
    }
    const userId = user[0].id
    const name = user[0].name
    const username = user[0].username
    const email = user[0].email
    const no_telp = user[0].no_telp
    const alamat = user[0].alamat
    const image = user[0].image
    const nik = user[0].nik
    const jk = user[0].jk
    const tgl = user[0].tanggal_lahir
    const role = user[0].role
    const accessToken = jwt.sign({userId, name, username, email, no_telp, alamat, image,nik, jk, tgl, role}, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '20s'
    })
    const refreshToken = jwt.sign({userId, name, username, email, no_telp, alamat, image,nik, jk, tgl, role}, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d'
    })
    await Users.update({refresh_token: refreshToken}, {
      where: {
        id: userId
      }
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
      // secure: true ## for https
    })
    res.json({ accessToken,role })
  } catch (error) {
    console.log(error.message)
    return res.status(401).json({
      msg: error.message
    })
  }
}

export const Me = async(req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken
      if (!refreshToken) return res.status(204)
      const user = await Users.findAll({
        where: {
          refresh_token: refreshToken
        }
      })
      if (!user[0]) {
        return res.sendStatus(204)
      }

      const response = await Users.findOne({
        where:{
            id: user[0].id
        }
      })
      res.json(response)
    } catch (error) {
      console.log(error.message)
    }
};


export const Logout = async(req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) return res.status(204)
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken
    }
  })
  if (!user[0]) {
    return res.sendStatus(204)
  }
  const userId = user[0].id
  await Users.update({
    refresh_token: null
  }, {
    where: {
      id: userId
    }
  })
  res.clearCookie('refreshToken')
  return res.sendStatus(200)
}

export const updateUsers = async(req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(204).json({msg: "data apa ini"});
    
    const Cekuser = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });

    if (!Cekuser) {
        return res.status(204).json({
            msg: "User Tidak Ditemukan"
        })
    }

    const idUsers = Cekuser[0].id
    const usernameUsers = Cekuser[0].username
    console.log('idusers', idUsers, usernameUsers)
    const user = await Users.findOne({
        where:{
            id: idUsers
        }
    })
    if (!user) {
        res.status(404).json({msg:"Data Tidak Ditemukan"})
    }
    let fileName = "default.png"
    if (req.files === null){
      fileName = user.image
    } else {
      const file = req.files.file
      const fileSize = file.data.length
      const ext = path.extname(file.name)
      fileName = file.md5 + ext
      const allowedType = ['.png','.jpg','.jpeg']

      if (!allowedType.includes(ext.toLowerCase())) {
          return res.status(422).json({msg:"Gambar Invalid"})
      }
      if (fileSize > 5000000) {
          return res.status(422).json({ msg: "Max Image Sized 5MB"})
      }

      file.mv(`./public/images/${fileName}`, (err) => {
          if (err) {
              return res.status(500).json({ msg: err.message})
          }
      })
    }

    const name = req.body.name
    const username = usernameUsers
    const email = req.body.email
    const no_telp = req.body.no_telp
    const alamat = req.body.alamat
    const tanggal_lahir = req.body.tanggal_lahir
    const jk = req.body.jk
    const nik = req.body.nik
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`

    try {
        await Users.update({
          name:name, 
          username: username, 
          email: email, 
          no_telp: no_telp, 
          alamat: alamat, 
          tanggal_lahir: tanggal_lahir, 
          jk: jk, 
          nik: nik, 
          image:fileName, 
          url:url
        }, {
            where: {
                id: idUsers
            }
        })
        res.status(200).json({
            msg: "Users Telah Diupdate"
        })
    } catch (error) {
        console.log(error.message)
        res.status(401).json({ msg: error.message, data: "tidak ada"})
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message, data: "tidak ada nih" });
} 
}

export const nePassword = async(req, res) => {
  const { email, password } = req.body

  const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: 'Email tidak ditemukan' });
    }

  const salt = await bcrypt.genSalt()
  const hashPassword = await bcrypt.hash(password, salt)
  try {
    await Users.update({ password: hashPassword }, { where: { email } });
    res.json({msg:"Update Password Berhasil"})
  } catch (error) {
    console.log(error)
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: 'Email tidak ditemukan' });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      service: 'gmail',
      auth: {
        user:  process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: 'kiravelnote@gmail.com',
      to: email,
      subject: 'Reset Password',
      text: 'Klik link ini untuk reset password: http://localhost:5173/reset-password',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'Gagal mengirim email reset password' });
      } else {
        console.log('Email reset password terkirim:', info.response);
        res.status(200).json({ msg: 'Email reset password berhasil dikirim' });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Terjadi kesalahan dalam proses reset password' });
  }
};

