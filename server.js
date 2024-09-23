const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    origin: '*', // Autorise toutes les origines
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  }));
  

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'urbanisme',
    password: 'mamy',
    port: '5432',
});

// app.post('/register', async (req, res) => {
//     const { email, password } = req.body;
//     const hashedPassword = bcrypt.hashSync(password, 8);

//     try {
//         const result = await pool.query(
//             'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
//             [email, hashedPassword]
//         );
//         res.status(201).json({ userId: result.rows[0].idUser});
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//         const user = result.rows[0];

//         if (!user) {
//             return res.status(400).json({ error: 'User not found' });
//         }

//         const isPasswordValid = bcrypt.compareSync(password, user.password);

//         if (!isPasswordValid) {
//             return res.status(401).json({ error: 'Invalid password' });
//         }

//         const token = jwt.sign({ idUser: user.idUser}, 'secret_key', { expiresIn: '1h'});

//         res.json({ token });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

//connection
pool.query('SELECT NOW()', (err, res)=> {
    if (err) {
        console.error('Erreur de connexion à la base de données', err);
    } else {
        console.log('connexion réussie à la base de données:', res.rows);
    }
});

//CRUD CLIENT

app.post("/ajoutclient", (req, res) => {
    const { numClient, nomClient, adresse, contact } = req.body;

    const sql = 'INSERT INTO client ("numClient", "nomClient", "adresse", "contact") VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [numClient, nomClient, adresse, contact];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'insertion du client', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.status(200).json({ message: 'Client ajouté avec succès', client: result.rows[0] });
    });
});

// Route pour récupérer la liste des clients
app.get("/listclient", (req, res) => {
    const sql = 'SELECT * FROM client';
    
    pool.query(sql, (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des clients', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        return res.status(200).json(result.rows); // On renvoie les résultats
    });
});

//Modifier client
app.get('/updateclient/:numClient', (req, res) => {
    const sql = 'SELECT * FROM client WHERE "numClient" = $1';
    const numClient = req.params.numClient;

    pool.query(sql, [numClient], (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération du client', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }

        return res.status(200).json(result.rows);
    });
});

app.put('/updateclient/:numClient', (req, res) => {
    const sql = 'UPDATE client SET "nomClient" = $1, "adresse" = $2, "contact" = $3 WHERE "numClient" = $4';
    const values = [
        req.body.nomClient,
        req.body.adresse,
        req.body.contact,
        req.params.numClient
    ];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour du client', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }

        return res.status(200).json({ message: 'Client mis à jour avec succès' });
    });
});

//supprimer client
app.delete('/client/:numClient', (req, res) => {
    const sql = 'DELETE FROM client WHERE "numClient" = $1';
    const numClient = req.params.numClient;

    pool.query(sql, [numClient], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression du client', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (result.rowCount === 0) {
            // Si aucun client n'a été supprimé (cas où numClient n'existe pas)
            return res.status(404).json({ message: 'Client non trouvé' });
        }

        return res.status(200).json({ message: 'Client supprimé avec succès' });
    });
});

// CRUD RESPONSABLE
app.post("/ajoutresponsable", (req, res) => {
    const { numResponsable, nomResponsable, motDePasse } = req.body;

    const sql = 'INSERT INTO responsable ("numResponsable", "nomResponsable", "motDePasse") VALUES ($1, $2, $3) RETURNING *';
    const values = [numResponsable, nomResponsable, motDePasse];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'insertion du responsable', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.status(200).json({ message: 'Responsable ajouté avec succès', responsable: result.rows[0] });
    });
});

// Route pour récupérer la liste des responsable
app.get("/listresponsable", (req, res) => {
    const sql = 'SELECT * FROM responsable';
    
    pool.query(sql, (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des responsables', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        return res.status(200).json(result.rows); // On renvoie les résultats
    });
});

//supprimer responsable
app.delete('/ajoutresponsable/:numResponsable', (req, res) => {
    const sql = 'DELETE FROM responsable WHERE "numResponsable" = $1';
    const numResponsable = req.params.numResponsable;

    pool.query(sql, [numResponsable], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression du responsable', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (result.rowCount === 0) {
            // Si aucun client n'a été supprimé (cas où numClient n'existe pas)
            return res.status(404).json({ message: 'responsable non trouvé' });
        }

        return res.status(200).json({ message: 'responsable supprimé avec succès' });
    });
});

//modifier un responsable
app.get('/updateresponsable/:numResponsable', (req, res) => {
    const sql = 'SELECT * FROM responsable WHERE "numResponsable" = $1';
    const numResponsable = req.params.numResponsable;

    pool.query(sql, [numResponsable], (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération du responsable', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'responsable non trouvé' });
        }

        return res.status(200).json(result.rows);
    });
});

app.put('/updateresponsable/:numResponsable', (req, res) => {
    const sql = 'UPDATE responsable SET "nomResponsable" = $1, "motDePasse" = $2 WHERE "numResponsable" = $3';
    const values = [
        req.body.nomResponsable,
        req.body.motDePasse,
        req.params.numResponsable
    ];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour du responsable', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Responsable non trouvé' });
        }

        return res.status(200).json({ message: 'Responsable mis à jour avec succès' });
    });
});

//CRUD VERIFICATEUR
app.post("/ajoutverificateur", (req, res) => {
    const { numVerificateur, nomVerificateur, dateDescente } = req.body;

    const sql = 'INSERT INTO verificateur ("numVerificateur", "nomVerificateur", "dateDescente") VALUES ($1, $2, $3) RETURNING *';
    const values = [numVerificateur, nomVerificateur, dateDescente];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'insertion du responsable', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.status(200).json({ message: 'Responsable ajouté avec succès', verificateur: result.rows[0] });
    });
});

// Route pour récupérer la liste des verificateurs
app.get("/listverificateur", (req, res) => {
    const sql = 'SELECT * FROM verificateur';
    
    pool.query(sql, (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des verificateurs', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        return res.status(200).json(result.rows); // On renvoie les résultats
    });
});

//supprimer un verificateur
app.delete('/ajoutverificateur/:numVerificateur', (req, res) => {
    const sql = 'DELETE FROM verificateur WHERE "numVerificateur" = $1';
    const numVerificateur = req.params.numVerificateur;

    pool.query(sql, [numVerificateur], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression du verificateur', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (result.rowCount === 0) {
            // Si aucun client n'a été supprimé (cas où numClient n'existe pas)
            return res.status(404).json({ message: 'Verificateur non trouvé' });
        }

        return res.status(200).json({ message: 'Verificateur supprimé avec succès' });
    });
});

//update verificateur

app.get('/updateverificateur/:numVerificateur', (req, res) => {
    const sql = 'SELECT * FROM verificateur WHERE "numVerificateur" = $1';
    const numVerificateur = req.params.numVerificateur;

    pool.query(sql, [numVerificateur], (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération du verificateur', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Verificateur non trouvé' });
        }

        return res.status(200).json(result.rows);
    });
});

app.put('/updateverificateur/:numVerificateur', (req, res) => {
    const sql = 'UPDATE verificateur SET "nomVerificateur" = $1, "dateDescente" = $2 WHERE "numVerificateur" = $3';
    const values = [
        req.body.nomVerificateur,
        req.body.dateDescente,
        req.params.numVerificateur
    ];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour du verificateur', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Verificateur non trouvé' });
        }

        return res.status(200).json({ message: 'Verificateur mis à jour avec succès' });
    });
});

//CRUD DEMANDE

app.post("/ajoutdemande", (req, res) => {
    const { numClient, dateDemande, typeDemande, longueur, largeur } = req.body;

    const sql = 'INSERT INTO demande ("numClient", "dateDemande", "typeDemande", "longueur", "largeur") VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [numClient, dateDemande, typeDemande, longueur, largeur];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'insertion de la demande', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.status(200).json({ message: 'Demande ajouté avec succès', demande: result.rows[0] });
    });
});


//list demande
app.get("/listdemande", (req, res) => {
    const sql = `
        SELECT demande."numDemande", client."nomClient", demande."dateDemande", demande."typeDemande", demande."longueur", demande."largeur"
        FROM client
        INNER JOIN demande ON client."numClient" = demande."numClient";
    `;

    pool.query(sql, (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des données', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.status(200).json(result.rows);
    });
});
//update demande

app.get('/updatedemande/:numDemande', (req, res) => {
    const sql = 'SELECT * FROM demande WHERE "numDemande" = $1';
    const numDemande = req.params.numDemande;
   
    pool.query(sql, [numDemande], (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération de la demande', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        return res.status(200).json(result.rows);
    });
});


app.put('/updatedemande/:numDemande', (req, res) => {
    console.log(req.params.numDemande); // Ajoutez ceci pour vérifier si numDemande est bien reçu
    
    const sql = 'UPDATE demande SET "dateDemande" = $1, "typeDemande" = $2, "longueur" = $3, "largeur" = $4 WHERE "numDemande" = $5';
    const values = [
        req.body.dateDemande,
        req.body.typeDemande,
        req.body.longueur,
        req.body.largeur,
        req.params.numDemande
    ];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour de la demande', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Demande non trouvée' });
        }

        return res.status(200).json({ message: 'Demande mise à jour avec succès' });
    });
});


app.listen(port, () => console.log('Listen on port 8000'))
