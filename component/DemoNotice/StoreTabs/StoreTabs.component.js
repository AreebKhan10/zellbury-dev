import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import MyComplainMyOrdersContainer from 'Component/MyComplainMyOrders';

export class StoreTabs extends PureComponent {
    
    state = {
        tabValue: "activeOrders"
    }

    static propTypes = {
        formRef: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.shape({ current: PropTypes.instanceOf(Element) })
        ])
    };
    
    static defaultProps = {
        formRef: () => {}
    };
    handleChange = (event, newValue) => {
        console.log('newValue', newValue);
        this.setState({tabValue : newValue})
    };

    render() {
        const {
            formRef,
            ...validProps
        } = this.props;

        return (
            <MyComplainMyOrdersContainer />
            // <TabContext value={value}>
            //     <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            //     <TabList onChange={this.handleChange}>
            //         <Tab label="Active Orders" value="activeOrders" />
            //         <Tab label="Delivered Orders" value="deliveredOrders" />
            //     </TabList>
            //     </Box>
            //     <TabPanel value="activeOrders">
            //         <MyComplainMyOrdersContainer />
            //     </TabPanel>
            //     <TabPanel value="deliveredOrders">
            //         Delivered Orders
            //     </TabPanel>
            // </TabContext>
            // <input
            //   autoFocus="true"
            //   ref={ formRef }
            //   { ...validProps }
            // />
        );
    }
}

export default StoreTabs;
