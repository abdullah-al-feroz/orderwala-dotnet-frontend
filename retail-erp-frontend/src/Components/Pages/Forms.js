import React from "react";

const Forms = () => {
  return (
    <div>
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Form Elements</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Basic Form Input</h6>
            <div className="row">
              <div className="col-lg">
                <input className="form-control" placeholder="Input box" type="text" />
              </div>
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <input className="form-control" placeholder="Input box (readonly)" readOnly type="text" />
              </div>
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <input className="form-control" placeholder="Input box (disabled)" disabled type="text" />
              </div>
              {/* col */}
            </div>
            {/* row */}
            <div className="row mg-t-20">
              <div className="col-lg">
                <textarea rows={3} className="form-control" placeholder="Textarea" defaultValue={""} />
              </div>
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <textarea rows={3} className="form-control" placeholder="Textarea (readonly)" readOnly defaultValue={""} />
              </div>
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <textarea rows={3} className="form-control" placeholder="Texarea (disabled)" disabled defaultValue={""} />
              </div>
              {/* col */}
            </div>
            {/* row */}
          </div>
          {/* card */}
        </div>
      </div>
    </div>
  );
};

export default Forms;
