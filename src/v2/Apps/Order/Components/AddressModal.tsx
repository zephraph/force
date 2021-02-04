import React from "react"
import { Button, Input, Modal, Spacer } from "@artsy/palette"
import {
  convertShippingAddressToMutationInput,
  SavedAddressType,
} from "../Utils/shippingAddressUtils"
import { useFormik } from "formik"
import {
  removeEmptyKeys,
  validateAddress,
  validatePhoneNumber,
} from "../Utils/formValidators"
import { CountrySelect } from "v2/Components/CountrySelect"
import { graphql } from "react-relay"
import { AddressModalMutation } from "v2/__generated__/AddressModalMutation.graphql"
import { CommitMutation } from "../Utils/commitMutation"
import { ConnectionHandler } from "relay-runtime"

interface Props {
  show: boolean
  onClose: () => void
  address: SavedAddressType
  commitMutation: CommitMutation
  meGraphqlID: string // FIXME:
}

const saveAddress = async (
  commitMutation: CommitMutation,
  userAddressID: string,
  values: any,
  meGraphqlID: string,
  onClose: () => null
) => {
  console.log(values)
  const useArtrubutes = convertShippingAddressToMutationInput(values)

  // TODO: add type <UpdateUserAddressMutation>
  const result = await commitMutation<AddressModalMutation>({
    variables: {
      input: {
        userAddressID: userAddressID,
        attributes: useArtrubutes, // TODO: fixme
      },
    },
    mutation: graphql`
      mutation AddressModalMutation($input: UpdateUserAddressInput!) {
        updateUserAddress(input: $input) {
          userAddressOrErrors {
            ... on UserAddress {
              id
              internalID
              name
              addressLine1
              isDefault
              phoneNumber
              city
              region
              postalCode
            }
            ... on Errors {
              errors {
                code
                message
              }
            }
          }
        }
      }
    `,
    updater: (store, data) => {
      console.log("do nothing")
      // const mutationResponse = store.getRootField("updateUserAddress")
      // const addressOrError = mutationResponse.getLinkedRecord(
      //   "userAddressOrErrors"
      // )
      // const meStore = store.get(meGraphqlID)
      // const addresses = ConnectionHandler.getConnection(
      //   meStore,
      //   "SavedAddresses_addressConnection"
      // )
      // const edge = ConnectionHandler.createEdge(
      //   store,
      //   addresses,
      //   addressOrError,
      //   "UserAddressEdge"
      // )
      // ConnectionHandler.createEdge(store, addresses, edge, "UserAddressEdge")
    },
  })
  onClose()
}

const validateor = (values: any) => {
  const validationResult = validateAddress(values)
  const phoneValidation = validatePhoneNumber(values.phoneNumber)
  const errors = Object.assign({}, validationResult.errors, {
    phoneNumber: phoneValidation.error,
  })
  return removeEmptyKeys(errors)
}

export const AddressModal: React.FC<Props> = ({
  show,
  onClose,
  address,
  commitMutation,
  meGraphqlID,
}) => {
  const formik = useFormik({
    initialValues: address,
    validate: validateor,
    onSubmit: values => {
      saveAddress(
        commitMutation,
        address.internalID,
        values,
        meGraphqlID,
        onClose
      )
    },
  })
  return (
    <Modal title="Edit address" show={show} onClose={onClose}>
      <form onSubmit={formik.handleSubmit}>
        <Input
          name="name"
          title="Full Name"
          onChange={formik.handleChange}
          error={formik.errors.name as string}
          value={formik.values.name}
        />
        <Spacer mb={1} />
        <Input
          name="postalCode"
          title="Postal Code"
          onChange={formik.handleChange}
          error={formik.errors.postalCode as string}
          value={formik.values.postalCode}
        />
        <Spacer mb={1} />
        <Input
          title="Address Line 1"
          name="addressLine1"
          onChange={formik.handleChange}
          error={formik.errors.addressLine as string}
          value={formik.values.addressLine1}
        />
        <Spacer mb={1} />
        <Input
          title="Address Line 2"
          name="addressLine2"
          onChange={formik.handleChange}
          error={formik.errors.addressLine2 as string}
          value={formik.values.addressLine2}
        />
        <Spacer mb={1} />
        <Input
          title="City"
          name="city"
          onChange={formik.handleChange}
          error={formik.errors.city as string}
          value={formik.values.city}
        />
        <Spacer mb={1} />
        <Input
          title="Region"
          name="region"
          onChange={formik.handleChange}
          error={formik.errors.region as string}
          value={formik.values.region}
        />
        <Spacer mb={1} />
        <CountrySelect
          selected={formik.values.country}
          onSelect={countryCode => {
            formik.setFieldValue("country", countryCode)
          }}
          error={formik.errors.country as string}
        />
        <Spacer mb={1} />
        <Input
          title="Phone number"
          name="phoneNumber"
          type="tel"
          onChange={formik.handleChange}
          error={formik.errors.phoneNumber as string}
          value={formik.values.phoneNumber}
        />
        <Button
          type="submit"
          size="large"
          loading={formik.isSubmitting}
          width="100%"
          mt={2}
        >
          Save changes
        </Button>
      </form>
    </Modal>
  )
}
