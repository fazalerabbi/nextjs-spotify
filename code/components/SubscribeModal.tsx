"user client";

import { FC, useState } from "react";
import { Price, ProductWithPrice } from "@/types";
import Modal from "./Modal";
import Button from "./Button";
import { formatPrice, postData } from "@/libs/helpers";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-hot-toast";
import { getStripe } from "@/libs/stripeClient";
import useSubscriptionModal from "@/hooks/useSubscriptionModal";

interface SubscribeModalProps {
    products: ProductWithPrice[]
}

const SubscribeModal: FC<SubscribeModalProps> = ({ products }) => {
    const subscribedModal = useSubscriptionModal();
    const { user, isLoading, subscription } = useUser();
    const [priceIdLoading, setPriceIdLoading] = useState<string>();

    const handleCheckout = async (price: Price) => {
        setPriceIdLoading(price.id);

        if (!user) {
            setPriceIdLoading(undefined);
            return toast.error('Must be logged in');
        }

        if (subscription) {
            setPriceIdLoading(undefined);
            return toast('Already Subscribed');
        }

        try {
            const { sessionId } = await postData({
                url: '/api/create-checkout-session',
                data: { price }
            });

            const stripe = await getStripe();
            console.log(stripe);
            stripe?.redirectToCheckout({ sessionId });
        } catch (error) {
            return toast.error((error as Error)?.message)
        } finally {
            setPriceIdLoading(undefined);
        }
    }

    const onChange = (open: boolean) => {
        if (!open) {
            subscribedModal.onClose();
        }
    }

    let content = (
        <div className="text-center">
            No products available.
        </div>
    );

    if (products && products.length > 0) {
        content = (
            <div>
                {products.map((product) => {
                    if (!product.prices?.length) {
                        return (
                            <div key={product.id}>
                                No Prices available
                            </div>
                        )
                    }

                    return product.prices.map((price) => {
                        return (
                            <Button
                                key={price.id}
                                onClick={() => handleCheckout(price)}
                                disabled={isLoading || price.id === priceIdLoading}
                                className="mb-4"
                            >
                                {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
                            </Button>
                        )
                    })
                })}
            </div>
        );
    }

    if (subscription) {
        content = (
            <div className="text-center">
                Already subscribed
            </div>
        );
    }
    return (
        <Modal
            title="Only for premium users"
            description="Listen to music with premium"
            isOpen={subscribedModal.isOpen}
            onChange={onChange}
        >
            {content}
        </Modal>
    );
}

export default SubscribeModal;