import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UsersCatalog from './page/UsersCatalog';

import './App.css';
import UserDetails from './page/UserDetails';
import NotFound from './page/NotFound';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<UsersCatalog />} />
				<Route path='/user/:userId' element={<UserDetails />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
