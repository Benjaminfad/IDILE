export function getOptimizedImageUrl(url, { width, height, crop = 'limit' } = {}) {
  if (!url || !String(url).includes('res.cloudinary.com') || !String(url).includes('/image/upload/')) {
    return url
  }

  const transformations = ['f_auto', 'q_auto:good']
  if (width) transformations.push(`w_${Math.round(width)}`)
  if (height) transformations.push(`h_${Math.round(height)}`)
  if (width || height) transformations.push(`c_${crop}`)

  return String(url).replace('/image/upload/', `/image/upload/${transformations.join(',')}/`)
}

export default getOptimizedImageUrl
