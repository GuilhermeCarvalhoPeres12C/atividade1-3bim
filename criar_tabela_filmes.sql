-- Execute este script no banco alunos_filmes03TB (usando a aba Query do seu client)

DROP TABLE `filmes_SophiaLealGuilhermeCarvalho`

CREATE TABLE filmes_SophiaLealGuilhermeCarvalho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    duration INT NOT NULL,
    age_rating VARCHAR(10) NOT NULL
);

INSERT INTO filmes_SophiaLealGuilhermeCarvalho (title, genre, duration, age_rating) VALUES
('O Poderoso Chefão', 'Drama', 175, '16'),
('Interestelar', 'Ficção Científica', 169, '10'),
('Divertida Mente', 'Animação', 95, 'Livre'),
('Coringa', 'Drama', 122, '16'),
('Vingadores: Ultimato', 'Ação', 181, '12'),
('A Origem', 'Ficção Científica', 148, '12'),
('Toy Story', 'Animação', 81, 'Livre'),
('Parasita', 'Drama', 132, '16'),
('Duna', 'Ficção Científica', 155, '12'),
('Matrix', 'Ficção Científica', 136, '14'),
('Cidade de Deus', 'Drama', 130, '18'),
('Homem-Aranha: Sem Volta Para Casa', 'Ação', 148, '12');
