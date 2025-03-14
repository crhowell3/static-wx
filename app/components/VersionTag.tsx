import type { JSX } from 'react'
import { version } from '../autobuild_version'

const VersionTag = (): JSX.Element => {
  return (
    <div className='app-tag text-gray-500 text-xs mt-4' style={{ width: '100%' }}>
      <em>static-wx v{version}</em>
    </div>
  )
}

export default VersionTag
