"use client";

import React, { useState, useEffect } from 'react';

interface Transaction {
  hash: string;
  type: string;
  blockHeight: string;
  age: string;
  fromTo: {
    from: string;
    to: string;
  };
  action: {
    fromAsset: string;
    fromAmount: string;
    toAsset: string;
    toAmount: string;
    fromIcon: string;
    toIcon: string;
    fromAssetFull: string;
    toAssetFull: string;
  };
}

interface ApiAction {
  date: string;
  height: string;
  in: Array<{
    txID: string;
    address: string;
    coins: Array<{
      asset: string;
      amount: string;
    }>;
  }>;
  out: Array<{
    txID: string;
    address: string;
    coins: Array<{
      asset: string;
      amount: string;
    }>;
  }>;
  type: string;
  status: string;
  pools: string[];
}

const HistoricalTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('L1 Swaps');
  const [totalPages, setTotalPages] = useState(1);
  
  const TRANSACTIONS_PER_PAGE = 8;

  const filters = [
    'All', 'L1 Swaps', 'Secure', 'Trade Swaps', 'Synth Swaps', 
    'LP / Savers', 'RUNEPool', 'Send', 'Refund', 'Switch', 'Contract', 'TCY'
  ];

  const fetchTransactions = async (filterType?: string, page: number = 1) => {
    try {
      setLoading(true);
      
      // Calculate offset based on page number
      const offset = (page - 1) * TRANSACTIONS_PER_PAGE;
      
      // Build API URL with filter parameters
      // Data Source: THORChain Midgard API - Official public API for THORChain network data
      // Documentation: https://midgard.ninerealms.com/v2/doc
      // This endpoint provides real-time transaction data from the THORChain network
      let apiUrl = `https://midgard.ninerealms.com/v2/actions?limit=${TRANSACTIONS_PER_PAGE}&offset=${offset}`;
      
      // Add type filter based on selected tab
      if (filterType && filterType !== 'All') {
        const typeMap: { [key: string]: string } = {
          'L1 Swaps': 'swap',
          'Secure': 'addLiquidity',
          'Trade Swaps': 'swap',
          'Synth Swaps': 'swap',
          'LP / Savers': 'addLiquidity,withdraw',
          'RUNEPool': 'addLiquidity',
          'Send': 'send',
          'Refund': 'refund',
          'Switch': 'switch',
          'Contract': 'donate',
          'TCY': 'donate'
        };
        
        const apiType = typeMap[filterType];
        if (apiType) {
          apiUrl += `&type=${apiType}`;
        }
      }
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      const formattedTransactions: Transaction[] = data.actions?.map((action: ApiAction) => {
        const timeAgo = getTimeAgo(action.date);
        const fromCoin = action.in?.[0]?.coins?.[0];
        const toCoin = action.out?.[0]?.coins?.[0];
        
        return {
          hash: action.in?.[0]?.txID || 'N/A', // Store full hash for copying
          type: action.type === 'swap' ? 'SWAP' : action.type.toUpperCase(),
          blockHeight: formatBlockHeight(action.height),
          age: timeAgo,
          fromTo: {
            from: action.in?.[0]?.address || 'N/A', // Store full address for copying
            to: action.out?.[0]?.address || 'N/A'   // Store full address for copying
          },
          action: {
            fromAsset: getAssetSymbol(fromCoin?.asset || ''),
            fromAmount: formatAmount(fromCoin?.amount || '0'),
            toAsset: getAssetSymbol(toCoin?.asset || ''),
            toAmount: formatAmount(toCoin?.amount || '0'),
            fromIcon: getAssetIcon(fromCoin?.asset || ''),
            toIcon: getAssetIcon(toCoin?.asset || ''),
            fromAssetFull: fromCoin?.asset || '',
            toAssetFull: toCoin?.asset || ''
          }
        };
      }) || [];

      setTransactions(formattedTransactions);
      
      // Calculate total pages (estimate based on typical blockchain activity)
      // For a more accurate count, we'd need a separate API call to get total count
      // For now, we'll show up to 99 pages as shown in the UI
      setTotalPages(99);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(parseInt(dateString) / 1000000);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const getAssetSymbol = (asset: string): string => {
    if (!asset) return '';
    const parts = asset.split('.');
    return parts[parts.length - 1] || asset;
  };

  const getAssetIcon = (asset: string): string => {
    const symbol = getAssetSymbol(asset).toLowerCase();
    // Map common assets to their icons
    const iconMap: { [key: string]: string } = {
      'btc': '₿',
      'eth': 'Ξ',
      'rune': 'ᚱ',
      'usdc': '$',
      'usdt': '₮',
      'bnb': 'B',
      'atom': '⚛',
      'doge': 'Ð'
    };
    return iconMap[symbol] || symbol.charAt(0).toUpperCase();
  };

  const getAssetTooltip = (asset: string): string => {
    const symbol = getAssetSymbol(asset).toUpperCase();
    // Map common assets to their full names
    const nameMap: { [key: string]: string } = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'RUNE': 'THORChain',
      'USDC': 'USD Coin',
      'USDT': 'Tether',
      'BNB': 'Binance Coin',
      'ATOM': 'Cosmos',
      'DOGE': 'Dogecoin',
      'LTC': 'Litecoin',
      'BCH': 'Bitcoin Cash',
      'AVAX': 'Avalanche',
      'LUNA': 'Terra Luna',
      'DOT': 'Polkadot',
      'LINK': 'Chainlink',
      'UNI': 'Uniswap',
      'AAVE': 'Aave',
      'SUSHI': 'SushiSwap',
      'COMP': 'Compound',
      'MKR': 'Maker',
      'SNX': 'Synthetix',
      'CRV': 'Curve DAO Token',
      'YFI': 'yearn.finance',
      'WBTC': 'Wrapped Bitcoin',
      'WETH': 'Wrapped Ethereum',
      'DAI': 'Dai Stablecoin'
    };
    
    const fullName = nameMap[symbol];
    return fullName ? `${symbol} - ${fullName}` : symbol;
  };

  const formatAmount = (amount: string): string => {
    const num = parseInt(amount) / 100000000; // Convert from base units
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(4);
  };

  const formatBlockHeight = (blockHeight: string): string => {
    const num = parseInt(blockHeight);
    return num.toLocaleString(); // This will add comma separators
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchTransactions(activeFilter, newPage);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            className={`page-number ${currentPage === i ? 'active' : ''}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        // Show 1, 2, 3, 4, ..., 99
        for (let i = 1; i <= 4; i++) {
          pages.push(
            <button
              key={i}
              className={`page-number ${currentPage === i ? 'active' : ''}`}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          );
        }
        pages.push(<span key="ellipsis1" className="page-dots">...</span>);
        pages.push(
          <button
            key={totalPages}
            className="page-number"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        );
      } else if (currentPage >= totalPages - 2) {
        // Show 1, ..., 96, 97, 98, 99
        pages.push(
          <button
            key={1}
            className="page-number"
            onClick={() => handlePageChange(1)}
          >
            1
          </button>
        );
        pages.push(<span key="ellipsis2" className="page-dots">...</span>);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(
            <button
              key={i}
              className={`page-number ${currentPage === i ? 'active' : ''}`}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          );
        }
      } else {
        // Show 1, ..., current-1, current, current+1, ..., 99
        pages.push(
          <button
            key={1}
            className="page-number"
            onClick={() => handlePageChange(1)}
          >
            1
          </button>
        );
        pages.push(<span key="ellipsis3" className="page-dots">...</span>);
        
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(
            <button
              key={i}
              className={`page-number ${currentPage === i ? 'active' : ''}`}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          );
        }
        
        pages.push(<span key="ellipsis4" className="page-dots">...</span>);
        pages.push(
          <button
            key={totalPages}
            className="page-number"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        );
      }
    }
    
    return pages;
  };

  useEffect(() => {
    fetchTransactions(activeFilter, 1); // Always start with page 1 on initial load
    
    // Live updates disabled during development
    // TODO: Re-enable polling when project is complete
    // const interval = setInterval(() => fetchTransactions(activeFilter, currentPage), 30000);
    // return () => clearInterval(interval);
  }, []); // Only run on component mount

  // Skeleton loading component
  const SkeletonRow = () => (
    <div className="table-row skeleton-row">
      <div className="table-cell">
        <div className="skeleton-text skeleton-hash"></div>
      </div>
      <div className="table-cell">
        <div className="skeleton-badge"></div>
      </div>
      <div className="table-cell">
        <div className="skeleton-text skeleton-block"></div>
      </div>
      <div className="table-cell">
        <div className="skeleton-text skeleton-age"></div>
      </div>
      <div className="table-cell">
        <div className="skeleton-address-container">
          <div className="skeleton-text skeleton-address"></div>
          <div className="skeleton-text skeleton-address"></div>
        </div>
      </div>
      <div className="table-cell">
        <div className="skeleton-action-container">
          <div className="skeleton-asset">
            <div className="skeleton-icon"></div>
            <div className="skeleton-text skeleton-amount"></div>
          </div>
          <div className="skeleton-arrow"></div>
          <div className="skeleton-asset">
            <div className="skeleton-icon"></div>
            <div className="skeleton-text skeleton-amount"></div>
          </div>
        </div>
      </div>
      <div className="table-cell"></div> {/* Empty cell to match grid */}
    </div>
  );

  return (
    <div className="historical-transactions-wrapper">
      <div className="transaction-header">
        <h2 className="transaction-title">Historical Transactions</h2>
        
        {/* Filter Tabs */}
        <div className="filter-tabs">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => {
                setActiveFilter(filter);
                setCurrentPage(1); // Reset to page 1 when filter changes
                fetchTransactions(filter, 1);
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="transaction-table-container">
        <div className="table-header">
          <div className="header-cell">TRANSACTION HASH</div>
          <div className="header-cell">TYPE</div>
          <div className="header-cell">BLOCK HEIGHT</div>
          <div className="header-cell">AGE</div>
          <div className="header-cell">FROM/TO</div>
          <div className="header-cell">ACTION</div>
          <div className="header-cell"></div> {/* Empty cell to fill remaining space */}
        </div>

        <div className="table-body">
          {loading ? (
            // Show skeleton rows while loading (8 rows to match page size)
            Array.from({ length: TRANSACTIONS_PER_PAGE }).map((_, index) => (
              <SkeletonRow key={`skeleton-${index}`} />
            ))
          ) : (
            transactions.map((tx, index) => (
            <div key={`${tx.hash}-${index}`} className={`table-row ${index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}`}>
              <div className="table-cell hash-cell">
                <span className="hash-text">{tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 6)}</span>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(tx.hash)}
                  title="Copy full transaction hash"
                >
                  <img src="/copy-paste-icon.svg" alt="Copy" />
                </button>
              </div>
              
              <div className="table-cell type-cell">
                <span className="type-badge">{tx.type}</span>
              </div>
              
              <div className="table-cell block-cell">
                {tx.blockHeight}
              </div>
              
              <div className="table-cell age-cell">
                {tx.age}
              </div>
              
              <div className="table-cell fromto-cell">
                <div className="address-container">
                  <div className="address-row">
                    <img src="/address-icon-top.svg" alt="From" className="address-icon" />
                    <span className="address-text">{tx.fromTo.from.substring(0, 8)}...{tx.fromTo.from.substring(tx.fromTo.from.length - 6)}</span>
                    <button 
                      className="copy-btn-small"
                      onClick={() => copyToClipboard(tx.fromTo.from)}
                      title="Copy full from address"
                    >
                      <img src="/copy-paste-icon.svg" alt="Copy" />
                    </button>
                  </div>
                  <div className="address-row">
                    <img src="/address-icon-bottom.svg" alt="To" className="address-icon" />
                    <span className="address-text">{tx.fromTo.to.substring(0, 8)}...{tx.fromTo.to.substring(tx.fromTo.to.length - 6)}</span>
                    <button 
                      className="copy-btn-small"
                      onClick={() => copyToClipboard(tx.fromTo.to)}
                      title="Copy full to address"
                    >
                      <img src="/copy-paste-icon.svg" alt="Copy" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="table-cell action-cell">
                <div className="action-container">
                  <div className="asset-info">
                    <span 
                      className="asset-icon bitcoin" 
                      title={getAssetTooltip(tx.action.fromAssetFull)}
                    >
                      {tx.action.fromIcon}
                    </span>
                    <span className="asset-amount">{tx.action.fromAmount}</span>
                    <span className="asset-symbol">{tx.action.fromAsset}</span>
                  </div>
                  <div className="arrow-container">
                    <span className="arrow">→</span>
                  </div>
                  <div className="asset-info">
                    <span 
                      className="asset-icon thorchain" 
                      title={getAssetTooltip(tx.action.toAssetFull)}
                    >
                      {tx.action.toIcon}
                    </span>
                    <span className="asset-amount">{tx.action.toAmount}</span>
                    <span className="asset-symbol">{tx.action.toAsset}</span>
                  </div>
                </div>
              </div>
              <div className="table-cell"></div> {/* Empty cell to fill remaining space */}
            </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <div className="pagination-left">
          <button 
            className="pagination-btn" 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ←
          </button>
          
          {/* Page Numbers */}
          {renderPageNumbers()}
          
          <button 
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            →
          </button>
        </div>
        
        <div className="pagination-right">
          <button className="load-more-btn">Load More</button>
        </div>
      </div>
    </div>
  );
};

export default HistoricalTransactions;
