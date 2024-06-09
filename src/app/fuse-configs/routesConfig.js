import React from 'react';
import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import ExampleConfig from 'app/main/example/ExampleConfig';
import ECommerceAppConfig from 'app/main/e-commerce/ECommerceAppConfig'
import FileManagement from 'app/main/file-manager/FileManagerAppConfig'

const routeConfigs = [ExampleConfig, ECommerceAppConfig, FileManagement];

const routes = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs),
	{
		path: '/',
		component: () => <Redirect to="/login" />
	}
];

export default routes;
