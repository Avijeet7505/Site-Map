
import React from 'react'
import { HeroBullets } from './HeroBullets'
import { CardsCarousel } from './CardsCarousel'
import { CarouselCard } from './CarouselCard'
import { FeaturesCards } from './FeaturesCards'

const Home = () => {
    return (
        <div>
            <HeroBullets></HeroBullets>
            {/* <CardsCarousel></CardsCarousel> */}
            {/* <CarouselCard></CarouselCard> */}
            <FeaturesCards></FeaturesCards>
        </div>
    )
}

export default Home