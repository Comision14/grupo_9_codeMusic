const db = require('../database/models');
const sequelize = db.sequelize;
const Users = db.User;
const { loadUsers, storeUsers } = require('../data/usersModule');
const { validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');

const usersController = {
    register: async (req, res) => {
      try {
        return res.render("users/register", {
          title: "Register",
        });
      } catch (error) {
        console.log(error);
      }
    },

    processRegister: async (req, res) => {
      try {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
          let { firstName, lastName, email, telephone, password} = req.body;
            const user = await db.User.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            username: "",
            musicFav: "[]",
            gender: "",
            biography: "",
            telephone: +telephone.trim(),
            password: bcryptjs.hashSync(password, 12)
          })
            return ((user) => {
              db.Address.create({
                userId: user.id,
            });

            req.session.userLogin = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
              };

            res.cookie('codeMusic', req.session.userLogin, {
                maxAge: 1000 * 60 * 60
            });

            res.redirect("/"); 
            })
            
        } else {
          res.render("users/register", {
            title: "register",
            errors: errors.mapped(),
            old: req.body
          });
        }
      } catch (error) {
        console.log(error);
      }
      },


    login: (req, res) => {
        return res.render("users/login", {
          title: "Login",
        });
    },

    processLogin: (req, res) => {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
          db.User.findOne({
            where: {
              email: req.body.email,
            },
          }).then((user) => {
            req.session.userLogin = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                telephone: user.telephone,
                category: user.category,
                avatar: user.avatar
            };
            if (req.body.remember) {
                res.cookie('codeMusic', req.session.userLogin, {
                    maxAge: 1000 * 60 * 60
                });
            }
            res.redirect("/");
          });
        } else {
          return res.render("/login", {
            title: "Login",
          });
        }
      },
      logout: (req, res) => {
        req.session.destroy();
        res.cookie('codeMusic', null, { maxAge: -1 });
        return res.redirect('/');
    },


    profile: (req, res) => {
      const id = req.session.userLogin?.id;
      db.User.findByPk(id)
        .then((user) => {
          return res.render("users/profile", {
            title: "Mi perfil",
            user,
          });
        })
        .catch((err) => console.log(err));
    },

};

module.exports = usersController;