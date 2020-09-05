import React from 'react';
import './App.css'
import { Card } from 'antd';
import ApiListContainer from './stores';
import SubmitForm from './components/submitForm';
import ApiTable from './components/apiTable';


function App() {
  return (
    <div className="page">
      <ApiListContainer.Provider initialState={[]}>
        <SubmitForm />
        <Card>
          <ApiTable />
        </Card>
      </ApiListContainer.Provider>
    </div>
  );
}

export default App;
