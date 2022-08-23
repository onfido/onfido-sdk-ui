rm -rf scripts/locales/base
mkdir scripts/locales/base
cd scripts/locales/base

# TODO: use git filter or spare checkout to only download the locales directory
echo "Downloading the locales from the development branch..."
git clone https://github.com/onfido/onfido-sdk-ui.git
mv onfido-sdk-ui/src/locales/** ./

echo "Cleaning up..."
rm -rf onfido-sdk-ui
