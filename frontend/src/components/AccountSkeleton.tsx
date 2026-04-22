import React from 'react';
import Skeleton from './Skeleton';

const AccountSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-900 border-4 border-yellow-400 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">
        <Skeleton width="200px" height="32px" variant="text" />
      </h2>
      
      <div className="space-y-4">
        <div>
          <Skeleton width="120px" height="16px" variant="text" className="mb-2" />
          <Skeleton width="180px" height="24px" variant="text" />
        </div>
        
        <div>
          <Skeleton width="140px" height="16px" variant="text" className="mb-2" />
          <Skeleton width="240px" height="32px" variant="text" />
        </div>
      </div>
    </div>
  );
};

export default AccountSkeleton;
