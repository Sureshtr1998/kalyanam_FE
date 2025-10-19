import { Carousel } from "primereact/carousel";
import { Image } from "primereact/image";
import "./CarouselImages.scss";

interface CarouselPage {
    remove?: (index: number, isExist: boolean) => void;
    images: (string | File)[];
}

const CarouselImages = (props: CarouselPage) => {
    const { images, remove } = props;

    const imagesWithIndex = images.map((item, index) => ({ item, index }));

    const imageTemplate = (data: { item: string | File; index: number }) => {
        const isExisting = typeof data.item === "string";
        const src = isExisting ? data.item : URL.createObjectURL(data.item as File);

        return (
            <div className="carousel-item-wrapper">
                <Image preview className="image-carousel" src={src as string} alt="Uploaded" />
                <div className="mt-8">
                    {remove && (
                        <button
                            type="button"
                            className="text-red-700 remove-btn pi pi-trash"
                            onClick={() => remove(data.index, isExisting)}
                        ></button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Carousel
            value={imagesWithIndex}
            itemTemplate={imageTemplate}
            numVisible={1}
            numScroll={1}
            showIndicators
        />
    );
};

export default CarouselImages;
