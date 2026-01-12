/**
 * Main entry point
 */

import { render } from 'preact';
import { App } from './App';
import './index.css';

const appElement = document.getElementById('app');
if (appElement) {
	render(<App />, appElement);
}
