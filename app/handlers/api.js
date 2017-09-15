/**
 * Created by Sergey Ganziy on 13.09.2017.
 */
const ObjectId = require('mongodb').ObjectID;
const bookSvc = require('../models/book');

module.exports = {
    // put /api/update-address/:addressId
    async updateAddress(req, res) {
        req.checkParams('addressId', 'Please provide address identifier.').isMongoId();
        req.checkBody('firstname', 'Please provide first name.').notEmpty();
        req.checkBody('lastname', 'Please provide start date.').notEmpty();
        req.checkBody('email', 'Please provide email.').notEmpty();
        const errors = await req.getValidationResult();
        if (!errors.isEmpty()) {
            const message = errors.array().map(error => error.msg).join('\n');
            return res.json({ success: false, message });
        }
        const payload = {
            updated_at: new Date(),
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        };
        const addressId = new ObjectId(req.params.addressId);
        try {
            const {result: { ok } } = await bookSvc.update(addressId, payload);
            if (1 !== ok) {
                return res.json({
                    success: false,
                    message: 'Error updating existing record. Please try again a little bit later.'
                });
            }
            res.json({success: true, message: 'Record has been updated successfully.'});
        } catch (err) {
            console.error(err, err.stack);
            res.json({ success: false, message: err.message });
        }
    },
    // delete /delete-address/:addressId
    async deleteAddress(req, res) {
        req.checkParams('addressId', 'Please provide record identifier.').isMongoId();
        const errors = await req.getValidationResult();
        if (!errors.isEmpty()) {
            const message = errors.array().map(error => error.msg).join('\n');
            return res.json({ success: false, message });
        }
        const addressId = new ObjectId(req.params.addressId);
        try {
            const {result: {ok}} = await bookSvc.deleteAddress(addressId);
            res.json({
                success: 1 === ok,
                message: 1 === ok ? 'Record was deleted successfully.' : 'Error deleting record.'
            });
        } catch (err) {
            console.error(err, err.stack);
            res.json({ success: false, message: err.message });
        }
    }
};
