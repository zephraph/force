import React from "react"
import styled from "styled-components"
import { Image, WebImageProps } from "@artsy/palette"
import { data } from "sharify"

const { GEMINI_CLOUDFRONT_URL } = data

const FeaturedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

type ImageCore = {
  alt: string
  loading?: "lazy" | "eager"
}

type MetaphysicsImage = ImageCore & {
  image: {
    sm: { src: string; srcSet: string }
    md: { srcSet: string }
    lg: { srcSet: string }
  }
  boundaries: number[]
}

type PalleteImage = ImageCore & {
  width: WebImageProps["width"]
  height: WebImageProps["height"]
  lazyLoad: WebImageProps["lazyLoad"]
  preventRightClick: WebImageProps["preventRightClick"]
  alt: WebImageProps["alt"]
  aspectRatio: number
  imageHeight: number
  imageUrl: string
  imageWidth: number
}

export interface SmartPictureSourceProps {
  maxWidth?: number
  minWidth?: number
  url: string
}

export interface SmartPictureProps {
  alt: string
  loading?: "lazy" | "eager"
  sourceSets: SmartPictureSourceProps[]
  src: string
}

// function mediaQuery(source: SmartPictureSourceProps): string {
//   if (source.maxWidth && source.minWidth) {
//     return `(max-width: ${source.maxWidth}px, min-width: ${source.minWidth}px)`
//   } else if (source.minWidth) {
//     return `(min-width: ${source.minWidth}px)`
//   } else if (source.maxWidth) {
//     return `(max-width: ${source.maxWidth}px)`
//   }
// }

// Handles the many different ways that we load image optimized images.
//
// 1. URLs from Metaphysics
// 2. <img srcset=[] />
// 3. <picture><source /></pricture>

export const SmartPicture: React.FC<MetaphysicsImage | PalleteImage> = (
  props: MetaphysicsImage | PalleteImage
) => {
  if (isImageFromMetaphysics(props)) {
    const { alt, loading = "lazy", image, boundaries } = props

    return (
      <picture>
        <source
          media={`(max-width: ${boundaries[0]}px)`}
          srcSet={image.sm.srcSet}
        />
        <source
          media={`(max-width: ${boundaries[1]}px)`}
          srcSet={image.md.srcSet}
        />
        <source
          media={`(min-width: ${boundaries[1]}px)`}
          srcSet={image.lg.srcSet}
        />
        <FeaturedImage src={image.sm.src} alt={alt} loading={loading} />
      </picture>
    )
  } else if (isPaletteImage(props)) {
    const { aspectRatio, imageUrl, imageHeight, imageWidth } = props

    let oneDpi
    let twoDpi
    if (data.IS_MOBILE) {
      oneDpi = getImageUrl(
        0.6,
        80,
        aspectRatio,
        imageUrl,
        imageHeight,
        imageWidth
      )
      twoDpi = getImageUrl(
        1.2,
        80,
        aspectRatio,
        imageUrl,
        imageHeight,
        imageWidth
      )
    } else {
      oneDpi = getImageUrl(
        1,
        80,
        aspectRatio,
        imageUrl,
        imageHeight,
        imageWidth
      )
      twoDpi = getImageUrl(
        2,
        80,
        aspectRatio,
        imageUrl,
        imageHeight,
        imageWidth
      )
    }
    return (
      <Image
        alt={props.alt}
        height={props.height}
        lazyLoad={props.lazyLoad}
        preventRightClick={props.preventRightClick}
        src={oneDpi}
        srcSet={`${oneDpi} 1x, ${twoDpi} 2x`}
        width="100%"
      />
    )
  } else {
    throw new Error("Unsupported Image format.")
  }
}

function isPaletteImage(
  image: MetaphysicsImage | PalleteImage
): image is PalleteImage {
  return (image as PalleteImage).preventRightClick !== undefined
}

function isImageFromMetaphysics(
  image: MetaphysicsImage | PalleteImage
): image is MetaphysicsImage {
  return (image as MetaphysicsImage).image !== undefined
}

function getImageUrl(
  pixelRatio: number,
  imageQuality: number,
  aspectRatio: number,
  imageUrl: string,
  imageHeight: number,
  imageWidth: number
) {
  // Either scale or crop, based on if an aspect ratio is 1. Either the image
  // actually is a square — or the geometry is missing and utilizing fill prevents
  // distortion when it is sized to fit.
  const type = aspectRatio === 1 ? "fill" : "fit"

  return `${GEMINI_CLOUDFRONT_URL}/?resize_to=${type}&width=${
    Math.round(imageWidth * pixelRatio * 100) / 100
  }&height=${
    Math.round(imageHeight * pixelRatio * 100) / 100
  }&quality=${imageQuality}&src=${encodeURIComponent(imageUrl)}`
}
