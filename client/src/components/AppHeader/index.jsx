import React from 'react'

import { Space } from 'antd'
import ProfileIcon from '../ProfileIcon'
import DropDownNotifications from '../DropDownNotifications'
import CourseNavigation from '../CourseNavigation'

import styled from 'styled-components'

const FlexedDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0 32px;
  background: #fff;
`

const AppHeader = ({ courseNavigation }) => {
  return (
    <FlexedDiv>
      <Space>{courseNavigation && <CourseNavigation />}</Space>
      <Space>
        <DropDownNotifications />
        <ProfileIcon />
      </Space>
    </FlexedDiv>
  )
}

export default AppHeader
