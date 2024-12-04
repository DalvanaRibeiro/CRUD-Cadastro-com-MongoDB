const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Para lidar com caminhos de arquivos

const app = express();
const PORT = 5000;

// Middleware para processar JSON e permitir requisições de outros domínios
app.use(cors());
app.use(bodyParser.json());

// Middleware para servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com o MongoDB
const uri = 'mongodb://localhost:27017';  // Conexão local
const client = new MongoClient(uri);
let db;

client.connect()
    .then(() => {
        db = client.db('crud_db'); // Nome do banco de dados
        console.log('Conectado ao MongoDB');
    })
    .catch(err => console.error(err));

// Rota para criar um item
app.post('/items', async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await db.collection('items').insertOne({ name, description });
        res.status(201).json(result.ops[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar item', error });
    }
});

// Rota para listar todos os itens
app.get('/items', async (req, res) => {
    try {
        const items = await db.collection('items').find().toArray();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar itens', error });
    }
});

// Rota para atualizar um item
app.put('/items/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const result = await db.collection('items').updateOne(
            { _id: new ObjectId(id) },
            { $set: { name, description } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Item não encontrado' });
        }
        res.status(200).json({ message: 'Item atualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar item', error });
    }
});

// Rota para deletar um item
app.delete('/items/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.collection('items').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Item não encontrado' });
        }
        res.status(200).json({ message: 'Item deletado' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar item', error });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
