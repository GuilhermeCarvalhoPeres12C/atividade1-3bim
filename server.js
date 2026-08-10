import express, { response } from "express"
import mysql2 from "mysql2"

const app = express()
app.use(express.json())

// GET - mostrar todos os filmes cadastrados
app.get("/all-movies", (request, response) => {
    const selectCommand = "SELECT * FROM filmes_SophiaLealGuilhermeCarvalho"
    sql.query(selectCommand, (error, data) => {
        if (error) {
            console.log(error)
            return
        }
        response.json(data)
    })
})

// POST - adicionar novo filme
app.post("/create-movie", (request, response) => {
    const { title, genre, duration, age_rating } = request.body
    const insertCommand = "INSERT INTO filmes_SophiaLealGuilhermeCarvalho(title, genre, duration, age_rating) VALUES (?, ?, ?, ?)"
    sql.query(insertCommand, [title, genre, duration, age_rating], (error) => {
        if (error) {
            console.log(error)
            return
        }
        response.status(201).json({
            message: "Filme criado com sucesso!"
        })
    })
})

// PUT - editar informações de um filme individualmente
app.put("/edit-movie/:id", (request, response) => {
    const { id } = request.params
    const { title, genre, duration, age_rating } = request.body
    const updateCommand = "UPDATE filmes_SophiaLealGuilhermeCarvalho SET title=?, genre=?, duration=?, age_rating=? WHERE id=?"
    sql.query(updateCommand, [title, genre, duration, age_rating, id], (error) => {
        if (error) {
            console.log(error)
            return
        }
        response.json({
            message: "Filme editado com sucesso!"
        })
    })
})

// DELETE - apagar filme
app.delete("/delete-movie/:id", (request, response) => {
    const { id } = request.params
    const deleteCommand = "DELETE FROM filmes_SophiaLealGuilhermeCarvalho WHERE id=?"
    sql.query(deleteCommand, [id], (error) => {
        if (error) {
            console.log(error)
            return
        }
        response.json({
            message: "Filme apagado com sucesso!"
        })
    })
})

app.listen(3067, () => {
    console.log("Servidor aberto na porta 3067")
})

const sql = mysql2.createPool({
    host: "benserverplex.ddns.net",
    port: 3306,
    user: "alunos",
    password: "senhaAlunos",
    database: "alunos_filmes03TB"
})
