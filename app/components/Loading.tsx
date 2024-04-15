'use client';
import React from 'react';
import './Loader.css';

const LoadingComponent: React.FC = () => {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
        </div>
    );
};

export default LoadingComponent;
