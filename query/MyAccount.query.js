/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { GUEST_QUOTE_ID } from 'Store/Cart/Cart.dispatcher';
import BrowserDatabase from 'Util/BrowserDatabase';
import { Field } from 'Util/Query';

/**
 * MyAccount Mutations
 * @class MyAccount
 */
export class MyAccountQuery {
    /**
     * Get ResetPassword mutation
     * @param {{token: String, password: String, password_confirmation: String}} options A object containing different aspects of query, each item can be omitted
     * @return {Field}
     * @memberof MyAccount
     */
    getResetPasswordMutation(options) {
        const { token, password, password_confirmation } = options;

        return new Field('resetPassword')
            .addArgument('token', 'String!', token)
            .addArgument('password', 'String!', password)
            .addArgument('password_confirmation', 'String!', password_confirmation)
            .addField('status');
    }

    /**
     * Get SignIn mutation
     * @param {{email: String, password: String}} options A object containing different aspects of query, each item can be omitted
     * @return {Field}
     * @memberof MyAccount
     */
    getSignInMutation(options) {
        const { phone,guest_quote_id } = options;
        return new Field('phone')
            .addArgument('phone', 'String!', phone);
        // const { email, password } = options;
        // const guestQuoteId = BrowserDatabase.getItem(GUEST_QUOTE_ID);

        // return new Field('generateCustomerToken')
        //     .addArgument('email', 'String!', email)
        //     .addArgument('password', 'String!', password)
        //     .addArgument('guest_quote_id', 'String!', guestQuoteId)
        //     .addField('token');
    }

    /**
     * Get SocialSignIn mutation
     * @param {{email: String, firstname: String}} options A object containing different aspects of query, each item can be omitted
     * @return {Field}
     * @memberof MyAccount
     */
    getSocialSignInMutation(options) {
        const { email, firstname } = options;
        const guestQuoteId = BrowserDatabase.getItem(GUEST_QUOTE_ID);

        return new Field('generateCustomerTokenSocialLogin')
            .addArgument('email', 'String!', email)
            .addArgument('firstname', 'String!', firstname)
            .addArgument('guest_quote_id', 'String!', guestQuoteId)
            .addField('token');
    }

    getUpdateInformationMutation(options) {
        console.log(">----getUpdateInformationMutation")
        return new Field('updateCustomer')
            .addArgument('input', 'CustomerInput!', options)
            .addField(this._getCustomerField());
    }

    getChangeCustomerPasswordMutation(options) {
        const { currentPassword, newPassword } = options;

        return new Field('changeCustomerPassword')
            .addArgument('currentPassword', 'String!', currentPassword)
            .addArgument('newPassword', 'String!', newPassword)
            .addField('id')
            .addField('email');
    }

    getCreateAddressMutation(options) {
        return new Field('createCustomerAddress')
            .addArgument('input', 'CustomerAddressInput!', options)
            .addFieldList(this._getAddressFields());
    }

    getDeleteAddressMutation(id) {
        return new Field('deleteCustomerAddress')
            .addArgument('id', 'Int!', id);
    }

    getUpdateAddressMutation(id, options) {
        return new Field('updateCustomerAddress')
            .addArgument('id', 'Int!', id)
            .addArgument('input', 'CustomerAddressInput!', options)
            .addFieldList(this._getAddressFields());
    }

    getCreateAccountMutation(options) {
        const { customer, password } = options;
        console.log(">----getCreateAccountMutation")


        return new Field('createCustomer')
            .addArgument('input', 'CustomerInput!', { ...customer, password })
            .addField(this._getCustomerField());
    }

    getConfirmAccountMutation(options) {
        const { key, email, password } = options;

        return new Field('confirmCustomerEmail')
            .addArgument('key', 'String!', key)
            .addArgument('email', 'String!', email)
            .addArgument('password', 'String!', password)
            .addFieldList(this._getConfirmAccountFields());
    }

    getCustomerQuery() {
        return this._getCustomerField();
    }

    _getConfirmAccountFields() {
        return [
            'status',
            'token',
            this._getCustomerField()
        ];
    }

    _getCustomerField() {
        return new Field('customer')
            .addFieldList(this._getCustomerFields());
    }

    _getCustomerFields() {
        return [
            'created_at',
            'customer_id',
            'quoteid',
            'confirmation_required',
            'group_id',
            'prefix',
            'firstname',
            'middlename',
            'lastname',
            'suffix',
            'email',
            'default_billing',
            'default_shipping',
            'dob',
            'taxvat',
            'id',
            'is_subscribed',
            'city',
            this._getAddressesField()
        ];
    }

    _getAddressesField() {
        return new Field('addresses')
            .addFieldList(this._getAddressFields());
    }

    _getRegionField() {
        return new Field('region')
            .addFieldList(this._getRegionFields());
    }

    _getRegionFields() {
        return [
            'region_code',
            'region',
            'region_id'
        ];
    }

    _getAddressFields() {
        return [
            'id',
            'customer_id',
            'country_id',
            'street',
            'telephone',
            'postcode',
            'city',
            'firstname',
            'lastname',
            'middlename',
            'prefix',
            'suffix',
            'default_shipping',
            'default_billing',
            this._getRegionField()
        ];
    }

    /**
     * Get ForgotPassword mutation
     * @param {{email: String}} options
     * @returns {Field}
     * @memberof MyAccount
     */
    getForgotPasswordMutation(options) {
        const { email } = options;

        return new Field('forgotPassword')
            .addArgument('email', 'String!', email)
            .addField('status');
    }

    getOtpMutation(options) {
        const { otp } = options;
        let phone = localStorage.getItem("phone");
        const guestQuoteId = BrowserDatabase.getItem(GUEST_QUOTE_ID);
        return new Field('verifyCustomerOtp')
            .addArgument('phone', 'String!', phone)
            .addArgument('code', 'ID!', otp)
            .addArgument('guest_quote_id', 'String!', guestQuoteId)
            .addField('status')
            .addField('response')
            .addField('new_user')
            .addField('token')
    }

    getSignInByNumberMutation(options) {
        const { phone } = options;
       
        return new Field('sendCustomerOtp')
            .addArgument('phone', 'String!', phone)
            
            .addField('status')
            .addField('response')
    }
}

export default new MyAccountQuery();
