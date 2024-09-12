return (
  <>
    <div
      style={{...}}
    >
      <div style={{ marginBottom: '25px' }}>
        {/* empDetails */}
        <div>
          <b>{empDet.theName}</b> {empDet.theDesig}, [{empDet.theGrade}]
        </div>
        <div>
          <i>
            Deptt:[{empDet.theDeptt}] Discipline: [{empDet.theDiscp}] [
            {empDet.theHrRate}Rs/hr]
          </i>
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        {/* Postings/Promotions */}
        <div
          style={{...}}
        >
          {/* Shows all change in designation */}
          <div style={{ padding: '10px', height: '40vh' }}>
            <PostingTrail theEmp={id} reportStatus = {(s)=>setStatus(s)} reportMsg = {(m)=>setMsg(m)}/>
          </div>
          {/* shows the edit window for adding/updating any change in designation */}
          <div style={{ padding: '10px' }}>
            <Posting theEmp={id} reportStatus = {(s)=>setStatus(s)} reportMsg = {(m)=>setMsg(m)} />
          </div>
        </div>

        {/* Transfers */}
        <div
          style={{...}}
        >
          {/* Shows all change in department */}
          <div style={{ padding: '10px', height: '40vh' }}>
            <TransferTrail theEmp={id}  reportStatus = {(s)=>setStatus(s)} reportMsg = {(m)=>setMsg(m)}/>
          </div>
          {/* shows the edit window for adding/updating any change in department */}
          <div style={{ padding: '10px' }}>
            <Transfer theEmp={id}  reportStatus = {(s)=>setStatus(s)} reportMsg = {(m)=>setMsg(m)}/>
          </div>
        </div>
      </div>
    </div>
  </>
);
};

export default TransferPosting;