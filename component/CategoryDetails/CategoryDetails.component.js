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

import './CategoryDetails.style';

import { PureComponent } from 'react';

import Html from 'Component/Html';
import Image from 'Component/Image';
import TextPlaceholder from 'Component/TextPlaceholder';
import { CategoryTreeType } from 'Type/Category';

/**
 * Category details
 * @class CategoryDetails
 */
export class CategoryDetails extends PureComponent {
    static propTypes = {
        category: CategoryTreeType.isRequired
    };

    renderCategoryName() {
        
        let { category } = this.props;

        if (category?.url?.substring(1, 4) === "men") {
          console.log(category?.url?.substring(1, 4), "url<-----40");
          localStorage.setItem("PageType", "men");
          localStorage.setItem("CategoryType", "men-new");
        }
    
        if (category?.url?.substring(1, 6) === "women") {
          localStorage.setItem("CategoryType", "women-new");
          localStorage.setItem("PageType", "Women");
          console.log(category?.url?.substring(1, 6), "url<-----47");
        }

  




        const { category: { name, id } } = this.props;

        if (id && !name) {
            return null;
        }

        // localStorage.setItem("CategoryType", name);

        console.log(name, "<-----name")

        return (
            <h1 block="CategoryDetails" elem="Heading">
                <TextPlaceholder content={ name } />
            </h1>
        );
    }

    renderCategoryDescription() {
        const { category: { description, id } } = this.props;

        if (!id) {
            return this.renderCategoryDescriptionPlaceholder();
        }

        if (!description) {
            return null;
        }

        return <Html content={ description } />;
    }

    renderCategoryDescriptionPlaceholder() {
        return (
            <p>
                <TextPlaceholder length="long" />
            </p>
        );
    }

    renderCategoryImagePlaceholder() {
        return (
            <Image
              mix={ { block: 'CategoryDetails', elem: 'Picture' } }
              objectFit="cover"
              ratio="custom"
              isPlaceholder
            />
        );
    }

    renderCategoryImage() {
        const { category: { image, id } } = this.props;

        if (!id) {
            return this.renderCategoryImagePlaceholder();
        }

        if (!image) {
            return null;
        }

        return (
            <Image
              mix={ { block: 'CategoryDetails', elem: 'Picture' } }
              src={ image || '' }
              ratio="custom"
              objectFit="cover"
            />
        );
    }

    render() {
        return (
            <article block="CategoryDetails">
                <div block="CategoryDetails" elem="Description">
                    { this.renderCategoryName() }
                    { this.renderCategoryDescription() }
                </div>
                { this.renderCategoryImage() }
            </article>
        );
    }
}

export default CategoryDetails;
