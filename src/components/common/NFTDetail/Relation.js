//@ts-nocheck
import React from "react";
import styles from "./Relation.module.scss";
import cn from "classnames/bind";
import items from "src/utils/items";

const cx = cn.bind(styles);
const DECORS_DESCRIPTION = "Furnishing item from the THEME decoration theme.";
const THEME = {
    99001: "Urban Lifestyle",
    99002: "Simple Plank",
    99004: "Rattan Ambience",
    99006: "Vintage Vibe",
    99015: "Natural Charm",
    99019: "Stonehouse",
    99007: "Country House",
    99008: "Bohemian look",
    99003: "Curly Girlie",
    99005: "Childlike Hideout",
    99009: "Classy Antique",
    99011: "Doll House",
    99013: "Streamer delight",
    99020: "Kawaii Garden",
    99012: "Pet Lover",
    99010: "Cracking Easter",
    99014: "Traditional Hanok",
    99016: "Spooky Halloween",
    99017: "Merry X-Mas",
    99018: "Lunar New Year",
    99021: "Full Moon Rite",
};

const Relation: React.FC<{ id: string | number; category: string }> = ({
    id,
    category,
}) => {
    const input = items[id].input;
    const output = items[id].output;
    const description = items[id].description;
    return (
        <div className={cx("relation")}>
            {input && (
                <>
                    <div className={cx("label")}>Input</div>
                    <div className={cx("output")}>
                        {input.map((item) => (
                            <div className={cx("output-item")} key={item}>
                                <img
                                    src={
                                        (`https://images.kawaii.global/kawaii-marketplace-image/items/${item}.png`)

                                    }
                                />{" "}
                                {items[item].name}
                            </div>
                        ))}
                    </div>
                </>
            )}
            {output && (
                <>
                    <div className={cx("label")}>Output</div>
                    <div className={cx("output")}>
                        {output.map((item) => (
                            <div className={cx("output-item")} key={item}>
                                <img
                                    src={
                                        (`https://images.kawaii.global/kawaii-marketplace-image/items/${item}.png`)

                                    }
                                />{" "}
                                {items[item].name}
                            </div>
                        ))}
                    </div>
                </>
            )}
            {category === "decors" && (
                <>
                    <div className={cx("label")}>Description</div>
                    <div className={cx("story")}>
                        {DECORS_DESCRIPTION.replace(
                            "THEME",
                            THEME[items[id].themeID]
                        )}
                    </div>
                </>
            )}
            {description && (
                <>
                    <div className={cx("label")}>Description</div>
                    <div className={cx("story")}>{description}</div>
                </>
            )}
        </div>
    );
};

export default Relation;
