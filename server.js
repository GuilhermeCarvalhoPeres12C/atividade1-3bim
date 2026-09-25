import express from "express"
import mysql2 from "mysql2"
import cors from 'cors';
 
const app = express()
 
app.use(express.json())
app.use(cors())
 
app.get("/", (request, response) => {
    const selectCommand = "SELECT * FROM filmes_SophiaLealGuilhermeCarvalho ORDER BY id DESC"
 
    sql.query(selectCommand, (error, data) => {
        if (error) {
            console.log(error)
            return response.status(500).json({ message: "Erro ao buscar os filmes." })
        }
 
        response.json(data)
    })
})
 
app.post("/create", (request, response) => {
    const { title, gender, duration, ageRating } = request.body
 
    if (!title || !gender || !duration || !ageRating) {
        return response.status(400).json({ message: "Preencha todos os campos: title, gender, duration e ageRating." })
    }
 
    const insertCommand = "INSERT INTO filmes_SophiaLealGuilhermeCarvalho(title, genre, duration, age_rating) VALUES (?, ?, ?, ?)"
 
    sql.query(insertCommand, [title, gender, duration, ageRating], (error) => {
        if (error) {
            console.log(error)
            return response.status(500).json({ message: "Erro ao criar o filme." })
        }
 
        response.status(201).json({
            message: "Filme criado com sucesso!"
        })
    })
})
 
app.delete("/delete/:id", (request, response) => {
    const { id } = request.params
 
    const deleteCommand = "DELETE FROM filmes_SophiaLealGuilhermeCarvalho WHERE id=?"
 
    sql.query(deleteCommand, [id], (error) => {
        if (error) {
            console.log(error)
            return response.status(500).json({ message: "Erro ao apagar o filme." })
        }
 
        response.json({
            message: "Filme apagado com sucesso!"
        })
    })
})
 
// atualizar tarefas
app.put("/update/:id", async (request, response) => {
    const { id } = request.params
    const { title, gender, duration, ageRating } = request.body
 
    if (!title || !gender || !duration || !ageRating) {
        return response.status(400).json({ message: "Preencha todos os campos: title, gender, duration e ageRating." })
    }
 
    const updateCommand = "UPDATE filmes_SophiaLealGuilhermeCarvalho SET title = ?, genre = ?, duration = ?, age_rating = ? WHERE id = ?"
 
    sql.query(updateCommand, [title, gender, duration, ageRating, id], (error) => {
        if (error) {
            console.log(error)
            return response.status(500).json({ message: "Erro ao atualizar o filme." })
        }
 
        response.json({
            message: "Filme atualizado com sucesso!"
        })
    })
})
 
app.listen(3067, () => {
    console.log("Servidor rodando na porta 67")
})
 
const sql = mysql2.createPool({
    host: "benserverplex.ddns.net",
    user: "alunos",
    password: "senhaAlunos",
    database: "alunos_filmes03TB"
})