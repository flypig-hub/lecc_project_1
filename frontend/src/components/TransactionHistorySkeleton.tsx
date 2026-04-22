import React from 'react';
import Skeleton from './Skeleton';

const TransactionHistorySkeleton: React.FC = () => {
  return (
    <div className="bg-gray-900 border-4 border-yellow-400 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">
        <Skeleton width="180px" height="32px" variant="text" />
      </h2>
      
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="bg-black border-2 border-yellow-600 rounded p-3 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Skeleton width="40px" height="32px" variant="circular" />
              <div>
                <Skeleton width="120px" height="20px" variant="text" />
                <Skeleton width="160px" height="16px" variant="text" className="mt-1" />
                <Skeleton width="100px" height="12px" variant="text" className="mt-1" />
              </div>
            </div>
            <div>
              <Skeleton width="100px" height="24px" variant="text" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <Skeleton width="200px" height="16px" variant="text" className="mx-auto" />
      </div>
    </div>
  );
};

export default TransactionHistorySkeleton;
