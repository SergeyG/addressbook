/**
 * Created by Sergey Ganziy on 13.09.2017.
 */
/**
 * Address Book service
 */
class BookService {
    /**
     * constructor
     */
    constructor() {
        this.collectionName = 'book';
        this.collection = null;
    }

    /**
     * connect to db
     * @method
     * @param {object} db
     */
    connect(db) {
        this.collection = db.collection(this.collectionName);
    }

    /**
     * Get all address records
     * @method
     * @return {*|{document}|Promise}
     */
    getAddress() {
        return this.collection.find();
    }

    /**
     * Insert new address into database
     * @method
     * @param {object} payload
     * @return {*|{document}|Promise}
     */
    insert(payload) {
        return this.collection.insertOne(payload);
    }

    /**
     * Initialize bulk write operation
     * @method
     * @return {*|{document}|Promise}
     */
    bulkStart() {
        return this.collection.initializeOrderedBulkOp();
    }

    /**
     * Update existing address
     * @method
     * @param {ObjectId} addressId
     * @param {object} payload
     * @return {UnorderedBulkOperation|OrderedBulkOperation|Promise|*|{filter, update}}
     */
    update(addressId, payload) {
        return this.collection.updateOne({
            _id: addressId
        }, {
            $set: payload
        }, {
            safe: true,
            multi: false
        });
    }

    /**
     * Remove address by identifier
     * @method
     * @param {ObjectId} addressId - address identifier
     * @return {*|{document}|Promise}
     */
    deleteAddress(addressId) {
        'use strict';

        return this.collection.deleteOne({ _id: addressId });
    }
}

module.exports = new BookService();
