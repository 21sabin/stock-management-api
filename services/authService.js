let userService = require('./userService');
var authService = (() => {
    let Admin = require('../models/user');
    async function createAdmin(admin) {
        return await Admin.create({
            fname: admin.fname,
            lname: admin.lname,
            email: admin.email,
            password: admin.password,
            active: true,
            role: admin.role
        })
    }

    function checkAdmin(admin) {
        return Admin.findOne({
            email: admin.email
        });
    }



    async function singIn(email, password) {
        console.log(email, password, "checklogin");
        return new Promise((resolve, reject) => {
            userService.fetchByEmail(email)
                .then((data) => {
                    resolve(data);
                }, (err) => {
                    reject(err);
                })
        })

    }

    return {
        createAdmin: createAdmin,
        singIn: singIn,
        checkAdmin: checkAdmin
    }

})();

module.exports = authService;