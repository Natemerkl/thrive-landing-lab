
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useAdminNavigation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Set active tab based on URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'users', 'payments', 'messages'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    console.log('Changing tab to:', newTab);
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  return {
    activeTab,
    handleTabChange
  };
};
