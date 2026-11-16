import React, { Component } from "react";
import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import $ from "jquery";

const responses = [
  {
    id: 1,
    title: "mr",
    firstname: "Satou",
    lastname: "Accountant",
    age: "2008/11/28",
    occupation: "Software Developer",
    hobby: "coding",
  },
  {
    id: 2,
    title: "mr",
    firstname: "Michael",
    lastname: "Jackson",
    age: 35,
    occupation: "Singer",
    hobby: "dancing",
  },
  {
    id: 3,
    title: "mr",
    firstname: "Janet",
    lastname: "Jackson",
    age: 35,
    occupation: "Singer",
    hobby: "dancing",
  },
];

class Testtable extends Component {
  componentDidMount() {
    if (!$.fn.DataTable.isDataTable("#myTable")) {
      // $(document).ready(function () {
      setTimeout(function () {
        $(".datatable").DataTable({
          bDestroy: true,
          // pagingType: "full_numbers",
          pagingType: "numbers",
          pageLength: 20,
          processing: true,
          dom: "Bfrtip",
          select: {
            style: "single",
          },

          buttons: [
            // {
            //   extend: "pageLength",
            //   className: "btn btn-secondary bg-secondary",
            // },
            {
              extend: "copy",
              className: "btn btn-dark bg-dark",
            },
            {
              extend: "csv",
              className: "btn btn-dark bg-dark",
            },
            {
              extend: "print",
              customize: function (win) {
                $(win.document.body).css("font-size", "10pt");
                $(win.document.body).find("table").addClass("compact").css("font-size", "inherit");
              },
              className: "btn btn-dark bg-dark",
            },
          ],

          fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            var index = iDisplayIndexFull + 1;
            $("td:first", nRow).html(index);
            return nRow;
          },

          lengthMenu: [
            [10, 20, 30, 50, -1],
            [10, 20, 30, 50, "All"],
          ],
          columnDefs: [
            {
              targets: 0,
              render: function (data, type, row, meta) {
                return type === "export" ? meta.row + 1 : data;
              },
            },
          ],
        });
      }, 1000);
      // });
    }
  }

  showTable = () => {
    try {
      return responses.map((item, index) => {
        return (
          <tr key={item.id}>
            <td className="text-xs">{index + 1}</td>
            <td className="text-xs">{item.title}</td>
            <td className="text-xs">{item.firstname + " " + item.lastname}</td>
            <td className="text-xs">{item.age}</td>
            <td className="text-xs">{item.hobby}</td>
            <td className="text-xs">{item.occupation}</td>
            <td></td>
          </tr>
        );
      });
    } catch (e) {
      alert(e.message);
    }
  };

  render() {
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
                <div className="table-responsive p-0 pb-2">
                  <table className="table table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">S/N</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">Title</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">Name</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">Age</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">Hobby</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">Occupation</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>{this.showTable()}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Testtable;
