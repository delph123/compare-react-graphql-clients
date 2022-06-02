import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UsersCatalog from './page/UsersCatalog';
import UserDetails from './page/UserDetails';
import NotFound from './page/NotFound';

import './App.css';

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
