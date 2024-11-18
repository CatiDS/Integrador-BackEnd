const { validationResult, body, check } = require("express-validator");

//separamos las reglas por un lado
const rulesUser = () => [
    body('mail')
        .notEmpty().withMessage('El e-mail no puede estar vacio')
        .isEmail().withMessage('Ingrese un e-mail valido')
        .normalizeEmail(),
    body('pass')
        .notEmpty().withMessage('La contraseña no puede estar vacia')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
        .isLength({ max: 16 }).withMessage('La contraseña debe tener como máximo 16 caracteres')
]


const personaRules = () => [
    // Validación para nombre (solo letras, mínimo 2 caracteres)
    check('nombre')
        .isAlpha('es-ES', { ignore: ' ' })
        .withMessage('El nombre debe contener solo letras')
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres'),

    // Validación para apellido (solo letras, mínimo 2 caracteres)
    check('apellido')
        .isAlpha('es-ES', { ignore: ' ' })
        .withMessage('El apellido debe contener solo letras')
        .isLength({ min: 2, max: 50 })
        .withMessage('El apellido debe tener entre 2 y 50 caracteres'),

    // // Validación para teléfono (formato de número telefónico internacional o local)
    // check('telefono')
    //     .matches(/^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/) /*(/^[+]?[0-9\s-]{7,15}$/)    /*(/^\(?\d{2}\)?[\s\.-]?\d{4}[\s\.-]?\d{4}$/)*/
    //     .withMessage('El teléfono debe ser un número válido con entre 7 y 15 dígitos')

];




// y el atrapador de errores por otro lado
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

module.exports = { validate, rulesUser, personaRules };
