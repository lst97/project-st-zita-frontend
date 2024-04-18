import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ThemeProvider, createTheme } from '@mui/material';

const defaultTheme = createTheme();

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <SpeedInsights />
        <ThemeProvider theme={defaultTheme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
