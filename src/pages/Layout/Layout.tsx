import { useAuth0 } from "@auth0/auth0-react"
import { Outlet } from "react-router"
import { useAppSelector } from "../../caches/hooks"
import { getAccessToken } from "../../caches/MyProfileSlice"
import DefaultHeader from "../../components/Header/Header"
import { useEffect } from "react"
import Loading from "../../components/icons/Loading"

const Layout = () => {
  const accessToken = useAppSelector(getAccessToken)
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) loginWithRedirect()
  }, [isLoading, isAuthenticated])

  return (
    <div>
      <div className="main_content">
        <span className="app" style={{ overflowX: "hidden" }}>
          <div className="app_body">
            <main className="main">
              {isAuthenticated && accessToken ? (
                <>
                  <DefaultHeader />
                  <Outlet />
                </>
              ) : (
                <>
                  <DefaultHeader />
                  <Loading />
                </>
              )}
            </main>
          </div>
        </span>
      </div>
    </div>
  )
}

export default Layout
