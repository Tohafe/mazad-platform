#!/bin/bash


DESCRIPTION="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

CATEGORY_ID=${1:-$(( (RANDOM % 13) + 1 ))}

CONDITIONS=("Mint Condition" "Rare" "Restored" "Brand New" "Vintage" "Antique")
BRANDS=("Sony" "Rolex" "Samsung" "Artisan" "Yamaha" "Handmade")
ITEMS=("Gaming Laptop" "Mechanical Keyboard" "Acoustic Guitar" "Diving Watch" "Persian Rug")
EXTRAS=("in Original Box" "with Accessories" "- Limited Edition" "with Certificate")

COND=${CONDITIONS[$RANDOM % ${#CONDITIONS[@]}]}
BRAND=${BRANDS[$RANDOM % ${#BRANDS[@]}]}
ITEM=${ITEMS[$RANDOM % ${#ITEMS[@]}]}
EXTRA=${EXTRAS[$RANDOM % ${#EXTRAS[@]}]}

TITLE="$COND $BRAND $ITEM $EXTRA"
PRICE=$(( (RANDOM % 2000) + 1 ))

THUMBNAIL="https://picsum.photos/seed/$RANDOM/600/450"

HOURS=$(( (RANDOM % 60) + 1 ))

SECONDS=$(( HOURS * 3600 ))

FUTURE_TIME=$(( $(date +%s) + SECONDS ))

ENDS_AT=$(python3 -c "from datetime import datetime, timezone; print(datetime.fromtimestamp($FUTURE_TIME, tz=timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'))")

ITEM=$(cat <<EOF
{
    "categoryId": "$CATEGORY_ID",
    "title": "$TITLE",
    "description": "$DESCRIPTION",
    "thumbnail": "$THUMBNAIL",
    "images": [
        "$THUMBNAIL",
        "https://picsum.photos/seed/$RANDOM/600/450",
        "https://picsum.photos/seed/$RANDOM/600/450",
        "https://picsum.photos/seed/$RANDOM/600/450"
    ],
    "specs": {
        "batch": "26",
        "origin": "Collector Market",
        "condition": "Excellent",
        "authenticity score": "98%",
        "material": "Patinated Brass & Mahogany",
        "production year": 1942,
        "weight":"1.2kg",
        "width":"20cm",
        "height":"15cm",
        "rarity index": "High",
        "last serviced": "2025-11-12"
    },
    "shippingInfo": "Worldwide shipping available.",
    "startingPrice": "$PRICE",
    "endsAt": "$ENDS_AT"
}
EOF
)

echo $ITEM