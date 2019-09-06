import NavLink from 'umi/navlink'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import { breadcrumbsRoutes as routes } from '../../router'
import styles from './style.less'

const Breadcrumbs = ({ breadcrumbs }) => (
  <div className={styles.breadcrumb}>
    {breadcrumbs.map(({ match, breadcrumb }, index) => (
      <span key={match.url}>
        <NavLink to={match.url}>{breadcrumb}</NavLink>
        {index < breadcrumbs.length - 1 && <i>/</i>}
      </span>
    ))}
  </div>
)

export default withBreadcrumbs(routes)(Breadcrumbs)
