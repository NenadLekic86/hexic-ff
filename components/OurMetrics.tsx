"use client";

import React, { useRef, useEffect } from 'react'
import DynamicMetrics from './DynamicMetrics';
import HistoricalTransactions from './HistoricalTransactions';

const OurMetrics = () => {
  return (
    <section className="ourmetrics-section relative md:pb-56">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="title-container relative pt-10 md:pt-28 md:pb-0 z-30">
                <h2 className="text-center mb-4 relative">
                    Our Metrics
                </h2>
            </div>
            <div className="metrics-container relative my-20">
                <DynamicMetrics />

                <div className="historical-transactions-container relative mt-12">
                    <HistoricalTransactions />
                </div>
            </div>
        </div>
    </section>
  )
}

export default OurMetrics
