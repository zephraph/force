import React from "react"
import { Link, Meta, Title } from "react-head"
import { getENV } from "v2/Utils/getENV"

const TITLE =
  "Art Gallery Shows and Museum Exhibitions | Artsy' : 'Art Gallery Shows and Museum Exhibitions | Artsy'"
const DESCRIPTION =
  "'Explore Artsy's comprehensive listing of current gallery shows and museum exhibitions from around the world.'"
const HREF = `${getENV("APP_URL")}/shows`
const IMAGE = "/images/og_image.jpg"

interface ShowsMetaProps {
  cityName?: string
}

export const ShowsMeta: React.FC<ShowsMetaProps> = ({ cityName }) => {
  const title = cityName ? `${cityName} ${TITLE}` : TITLE
  const description = cityName
    ? `Explore shows in ${cityName} on Artsy. ${DESCRIPTION}`
    : DESCRIPTION
  return (
    <>
      <Title>{title}</Title>
      <Meta property="og:title" content={title} />
      <Meta name="description" content={description} />
      <Meta property="og:description" content={description} />
      <Meta property="twitter:description" content={description} />
      <Link rel="canonical" href={HREF} />
      <Meta property="og:url" content={HREF} />
      <Meta property="og:type" content="website" />
      <Meta property="twitter:card" content="summary" />
      <Meta property="og:image" content={IMAGE} />
    </>
  )
}
