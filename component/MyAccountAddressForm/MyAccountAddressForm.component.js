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

import PropTypes from 'prop-types';

import FieldForm from 'Component/FieldForm';
import { addressType } from 'Type/Account';
import { countriesType } from 'Type/Config';

import BrowserDatabase from 'Util/BrowserDatabase';
import { isSignedIn } from 'Util/Auth';

export class MyAccountAddressForm extends FieldForm {
    static propTypes = {
        address: addressType.isRequired,
        countries: countriesType.isRequired,
        default_country: PropTypes.string,
        onSave: PropTypes.func
    };

    static defaultProps = {
        default_country: 'US',
        onSave: () => { }
    };

    constructor(props) {
        super(props);

        const {
            countries,
            default_country,
            address: { country_id, region: { region_id } = {} }
        } = props;

        const countryId = country_id || default_country;
        const country = countries.find(({ id }) => id === countryId);
        const { available_regions: availableRegions } = country || {};
        const regions = availableRegions || [{}];
        const regionId = region_id || regions[0].id;

        this.state = {
            countryId,
            availableRegions,
            regionId
        };
    }

    onFormSuccess = (fields) => {
        const { onSave } = this.props;
        const { region_id, region_string: region, ...newAddress } = fields;
        newAddress.region = { region_id, region };
        onSave(newAddress);
    };

    getRegionFields() {
        const { countryId } = this.state;
        const { address: { region: { region } = {} } } = this.props;
        const { availableRegions, regionId } = this.state;

        if (!availableRegions || !availableRegions.length) {
            if (countryId == 'PK') {
                return {
                    region: {
                        tabindex:'5',
                        label: __(''),
                        type: 'hidden',
                        value: 'Sindh'
                    }
                };
                // return {
                //     region_string: {
                //         label: __('State/Province'),
                //         placeholder: __('State/Province'),
                //         validation: ['enterState'],
                //         value: 'Sindh'
                //     }
                // };
            } else {
                return {
                    region_string: {
                        tabindex:'5',
                        label: __('State/Province'),
                        placeholder: __('State/Province'),
                        validation: ['enterState'],
                        value: ''
                    }
                };
            }
        }

        return {
            region_id: {
                label: __('State/Province'),
                type: 'select',
                selectOptions: availableRegions.map(({ id, name }) => ({ id, label: name, value: id })),
                onChange: (regionId) => this.setState({ regionId }),
                validation: ['selectState'],
                value: regionId
            }
        };
    }

    getCityFields() {
        const { countryId } = this.state;

        if (countryId == 'PK') {
            return {
                city: {
                    label: __('City'),
                    type: 'auto',
                    autocomplete: 'off',
                    placeholder: __('City'),
                    validation: ['selectCity', 'matchCity']
                }
            };
        }

        return {
            city: {
                label: __('City'),
                placeholder: __('City'),
                autocomplete: 'off',
                validation: ['enterCity']
            }
        };
    }

    getZipFields() {
        const { countryId } = this.state;

        if (countryId == 'PK') {
            return {
                postcode: {
                    label: __('Zip/Postal code'),
                    type: 'hidden',
                    value: '75400'
                }
            };
        }

        return {
            postcode: {
                label: __('Zip/Postal code'),
                placeholder: __('Zip/Postal code'),
                validation: ['enterZip']
            }
        };
    }

   
    getMobileFields() {
        const { countryId } = this.state;
       
        let localMobile = localStorage.getItem('phone')
         console.log(localMobile, "<----localMobile")
        if (countryId == 'PK' && localMobile) {
            return {
                telephone: {
                    tabindex:'3',
                    type: 'tel_masks',
                    autocomplete:"false" ,
                    label: __('Mobile number'),
                    placeholder: __('Mobile number'),
                    validation: ['telephonePk'],
                    value: localMobile.slice(3)
                    
                }
            };
        }

        return {
            telephone: {
                tabindex:'3',
                value: localMobile ?  localMobile.slice(3) : "",
                type: 'tel',
                autocomplete:"false",
                label: __('Mobile number'),
                placeholder: __('Mobile number'),
                validation: ['numberOnly']
            }
        };
    }

    onCountryChange = (countryId) => {
        const { countries } = this.props;
        const country = countries.find(({ id }) => id === countryId);
        const { available_regions } = country;

        this.setState({
            countryId,
            availableRegions: available_regions || []
        });
    };

    get fieldMap() {
        const { countryId } = this.state;
        const { countries, address } = this.props;
        const { default_billing, default_shipping, street = [] } = address;

        let fullName = '';
        if (isSignedIn()) {
            const customer = BrowserDatabase.getItem('customer') || {};
            fullName = customer.firstname === " " ? '' : customer.firstname  ;
        }

        return {
            default_billing: {
                type: 'checkbox',
                label: __('This is default Billing Address'),
                value: 'default_billing',
                checked: default_billing
            },
            default_shipping: {
                type: 'checkbox',
                label: __('This is default Shipping Address'),
                value: 'default_shipping',
                checked: default_shipping
            },
            firstname: {
                tabindex:'2',
                label: __('First name'),
                placeholder: __('Full name'),
                autocomplete: 'name',
                value: fullName,
                validation: ['fullName']
            },
            ...this.getMobileFields(),
            country_id: {
                tabindex:'4',
                type: 'select',
                label: __('Country'),
                validation: ['notEmpty'],
                value: countryId,
                selectOptions: countries.map(({ id, label }) => ({ id, label, value: id })),
                onChange: this.onCountryChange
            },
            ...this.getRegionFields(),
            ...this.getCityFields(),
            ...this.getZipFields(),
            street: {
                tabindex:'-1',
                label: __('Address (House No, Building, Street, Area, Landmark)'),
                placeholder: __('Address (House No, Building, Street, Area, Landmark)'),
                value: street[0],
                min: 3,
                autocomplete: 'street-address',
                validation: ['completeAddress']
            },
            lastname: {
                label: __(''),
                type: 'hidden',
                value: '-'
            }
            // Will be back with B2B update
            // company: {
            //     label: __('Company')
            // }
        };
    }

    getDefaultValues(fieldEntry) {
        const [key, { value }] = fieldEntry;
        const { address: { [key]: addressValue } } = this.props;

        return {
            ...super.getDefaultValues(fieldEntry),
            value: value !== undefined ? value : addressValue
        };
    }

    renderActions() {
        return (
            <button
                type="submit"
                block="Button"
                mix={{ block: 'MyAccount', elem: 'Button' }}
            >
                { __('Save address')}
            </button>
        );
    }
}

export default MyAccountAddressForm;
