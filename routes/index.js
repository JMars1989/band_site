const nodemailer = require('nodemailer');
const config = require('../config');
const mysql = require('mysql');

module.exports = {
    getHomePage: (req, res) => {
        res.render('home');
    },

    getPressPage: (req, res) => {
        res.render('press');
    },

    getContactPage: (req, res) => {
        res.render('contact');
    },

    postContactPage: (req, res) => {
        let mailOpts, smtpTrans;
        smtpTrans = nodemailer.createTransport({
            host: config.emailHost,
            port: config.emailPort,
            secure: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            },
            disableFileAccess: true
        });
        mailOpts = {
            from: req.body.name + ' &lt;' + req.body.email + '&gt;',
            to: config.emailUser,
            subject: 'New message from contact form',
            text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
        };
        smtpTrans.sendMail(mailOpts, function (error, response) {
            if (error) {
                res.end('contact-failure');
            }
            else {
                res.render('contact', { contactSuccess: "Thanks!" });
            }
        });
    },

    getSubPage: (req, res) => {
        res.render('subscribe');
    },

    postSubPage: (req, res) => {
        const connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.pass,
            database: config.database
        });
        let sql = `INSERT INTO ${config.table}(email,name) 
        VALUES('${req.body.email}','${req.body.name}')`;

        connection.query(sql);
        connection.end();
    },

    subscribe: (req, res) => {
        const connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.pass,
            database: config.database
        });

        let sql = `INSERT INTO ${config.table}(email,name) 
                VALUES('${req.body.email}','${req.body.name}')`;
        connection.query(sql);
        connection.end();

        res.render('home');
    }
}