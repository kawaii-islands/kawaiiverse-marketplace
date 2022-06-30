//@ts-nocheck
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "./Carousel.module.scss";
import cn from "classnames/bind";
import { useRef, useEffect } from "react";

const cx = cn.bind(styles);

const responsive = {
	desktop: {
		breakpoint: { max: 3000, min: 440 },
		items: 4,
	},
	mobile: {
		breakpoint: { max: 440, min: 0 },
		items: 3,
	},
};

const NFTCarousel = ({ listNftInBundle, item, setItem }) => {
	const carousel = useRef();
	const prevIndex = useRef();

	useEffect(() => {
		if (prevIndex.current < item) carousel.current.next();
		else if (prevIndex.current > item) carousel.current.previous();
		prevIndex.current = item;
	}, [item]);

	return (
		<Carousel
			ref={carousel}
			additionalTransfrom={0}
			swipeable={true}
			draggable={true}
			showDots={false}
			responsive={responsive}
			arrows={false}
			ssr={false}
			infinite={false}
			autoPlay={false}
			autoPlaySpeed={1000}
			// keyBoardControl={true}
			customTransition="all 1s"
			transitionDuration={500}
			removeArrowOnDeviceType={[]}
			containerClass={cx("container")}
			slidesToSlide={1}>
			{listNftInBundle?.map((nft, index) => (
				<div className={cx("carousel-item")} key={index} onClick={() => setItem(index)}>
					<div className={cx("carousel-item-container", item === index && "active")}>
						<img className={cx("avatar")} src={nft.data.data.imageUrl} />
					</div>
				</div>
			))}
		</Carousel>
	);
};

export default NFTCarousel;
