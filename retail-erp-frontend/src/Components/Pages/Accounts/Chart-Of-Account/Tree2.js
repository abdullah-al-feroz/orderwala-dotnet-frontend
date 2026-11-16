import { ReactTree, useReactTreeApi } from "@naisutech/react-tree";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import TreeNode from "./TreeNode";

const List = () => {
  const treeApi = useReactTreeApi();

  const data = [
    {
      id: 1,
      label: "Parent 1",
      children: [
        {
          id: 2,
          label: "Child 1.1",
          children: [
            {
              id: 4,
              label: "Grandchild 1.1.1",
              children: [],
            },
          ],
        },
        {
          id: 3,
          label: "Child 1.2",
          children: [],
        },
      ],
    },
    {
      id: 5,
      label: "Parent 2",
      children: [
        {
          id: 6,
          label: "Child 2.1",
          children: [],
        },
      ],
    },
  ];

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Chart Of Accounts Lists</h5>
            <Link to="/create-chart-of-account" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>Create
            </Link>
          </div>

          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
              <table className="table">
                <thead>
                  <tr>
                    <th>Label</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((node) => (
                    <tr key={node.id}>
                      <td>
                        <TreeNode node={node} />
                      </td>
                      <td>{/* Add any actions you want here */}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
