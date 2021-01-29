import React from "react"
import { AppContainer } from "v2/Apps/Components/AppContainer"
import { HorizontalPadding } from "v2/Apps/Components/HorizontalPadding"
import { Footer } from "v2/Components/Footer"

interface ShowsAppProps {}

export const ShowsApp: React.FC<ShowsAppProps> = ({ children }) => {
  return (
    <AppContainer>
      <HorizontalPadding>
        {children}

        <Footer />
      </HorizontalPadding>
    </AppContainer>
  )
}
