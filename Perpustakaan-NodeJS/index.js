// inisialisasi aplikasi menggunakan express js
const express = require("express")
const cors = require("cors")
const mysql = require("mysql")

// implementasikan
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
})) // untuk mendapatkan value pada url-nya

// connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "perpustakaan"
})

// untuk mengecek koneksi dengan database
db.connect(error => {
    if (error) {
        console.log(error.message)
    } else {
        console.log("Mysql Connected")
    }
})

// endpoint endpoint
app.get("/", (req, res) => {
    res.send({
        message: "Berhasil melakukan pemanggilan get",
        data: {
            description: "Endpoint ini untuk menampilkan data",
        }
    })
})

// menampilkan semua buku dari database
app.get("/books", (req, res) => {

    // create sql query
    let sql = "select * from perpustakaan"

    // run query
    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                result
            }
        }
        res.json(response)
    })
})

// menampilkan buku berdasarkan id
app.get("/books/:id", (req, res) => {
    let id = req.params.id
    db.query(`select * from perpustakaan where id = '${id}'`, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                result
            }
        }
        res.json(response)
    })
})


// tambah buku
app.post("/books", (req, res) => {
    let book = {
        title: req.body.title,
        year: req.body.year,
    }
    db.query(`insert into perpustakaan set ?`, book, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            res.send({
                message: "Berhasil menambahkan buku",
                data: {
                    newBook: book,
                }
            })
            console.log(result)
        }
    })
});

// update buku
app.put("/books/:id", (req, res) => {
    const id = req.params.id;
    let book = {
        title: req.body.title,
        year: req.body.year,
    }
    db.query(`update perpustakaan set ? where id = '${id}'`, book, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            res.send({
                message: "Berhasil update buku",
                data: {
                    updateBook: book,
                }
            })
        }
    })
})


//delete data
app.delete("/books/:id", (req, res) => {
    const id = req.params.id;
    db.query(`delete from perpustakaan where id = '${id}'`, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            res.send("Berhasil menghapus buku")
            console.log("Berhasil menghapus buku", result)
        }
    })
})
const port = 8000;
app.listen(port, () => console.log(`App running ${port}`))