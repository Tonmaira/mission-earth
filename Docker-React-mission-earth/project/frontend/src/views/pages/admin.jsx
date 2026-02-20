import React from 'react'
import NavList from './../../components/NavList'
import './../../style/home.css'
import AdminMenuList from '../../components/admin/menulist'

function AdminMenu() {
  return (
    <div className="page_home_body" style={{flexDirection:"row"}}>
      <NavList width="25rem" />
      <AdminMenuList title="Admin Menu" />
    </div>
  )
}

export default AdminMenu
