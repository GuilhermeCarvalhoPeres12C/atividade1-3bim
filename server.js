import express from "express"
import mysql2 from "mysql2"
import cors fromt 'cors';

const app = express()

// CRUD => Create, Read, Update, Delete

app.use(express.json())
app.use(cors())

app.get("/", (request, response) => {
    const selectCommand = "SELECT * FROM filmes_SophiaLealGuilhermeCarvalho"

    sql.query(selectCommand, (error, data) => {
        if (error) {
            console.log(error)
            return
        }

        response.json(data)
    })
})

app.post("/create", (request, response) => {
    const { title, gender, duration, ageRating } = request.body

    const insertCommand = "INSERT INTO filmes_SophiaLealGuilhermeCarvalho(title, gender, duration, ageRating) VALUES (?, ?, ?, ?)"

    sql.query(insertCommand, [title, gender, duration, ageRating], (error) => {
        if (error) {
            console.log(error)
            return
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
            return
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

    const updateCommand = "UPDATE filmes_SophiaLealGuilhermeCarvalho SET title = ?, gender = ?, duration = ?, ageRating = ? WHERE id = ?"

        sql.query(updateCommand, [title, gender, duration, ageRating, id], (error) => {
            if (error) {
                console.log(error)
                return
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

const grid = document.getElementById('grid');
const status = document.getElementById('status');
 
async function carregarFilmes() {
  try {
    const resposta = await fetch('http://localhost:3067');
    const filmes = await resposta.json();
    grid.innerHTML = filmes.map(filme => `
      <div class="card">
        <div>
          <div class="id">#${String(filme.id).padStart(3, '0')}</div>
          <div class="title">${filme.title}</div>
          <div class="gender">${filme.gender}</div>
        </div>
        <div class="meta">
          <span>${filme.duration} min</span>
          <span class="rating">${filme.ageRating === 0 ? 'LIVRE' : filme.ageRating + '+'}</span>
        </div>
      </div>
    `).join('');
  } catch (erro) {
    status.textContent = 'Não foi possível carregar os filmes no momento.';
  }
}
 
carregarFilmes();