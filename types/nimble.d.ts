import { Maybe } from "./api";

export type NimbleDonation = {
  NU__Account2__r: {
    Name: string;
    APSID__c: string;
  };
  NU__Amount__c: number;
  DonorName__c: string | null;
  NU__Anonymous__c: boolean;
  NU__Product2__r: {
    NU__ShortName__c: string;
  };
};

type NimbleProduct = {
  // Name of the product
  Name?: Maybe<string>;
  // Code for the Event/Meeting the product belongs to, e.g. MARCH2022
  ActivityCode__c?: Maybe<string>;
  DeferredRevenueGLAccount__c?: Maybe<string>;
  DisplayDonationMessage__c?: Maybe<boolean>;
  Exhibitor_Store_Display__c?: Maybe<boolean>;
  // Nimble product id
  Id: string;
  IsLifetime__c?: Maybe<boolean>;
  IsProla__c?: Maybe<boolean>;
  IsSuggestedDonationsEnabled__c?: Maybe<boolean>;
  LimitByRemainingMembershipDays__c?: Maybe<boolean>;
  MembersOnlyProduct__c?: Maybe<boolean>;
  MinimumRemainingDaysofMembership__c?: Maybe<number>;
  NU__AllowCrossEntityCoupon__c?: Maybe<boolean>;
  NU__BillMeEnabled__c?: Maybe<boolean>;
  NU__CanNotBeSoldSeparately2__c?: Maybe<boolean>;
  NU__CheckoutUrl__c?: Maybe<string>;
  NU__DeferredRevenueMethod__c?: Maybe<string>;
  NU__Description__c?: Maybe<string>;
  NU__DescriptionRichText__c?: Maybe<unknown>;
  NU__DisplayOrder__c?: Maybe<number>;
  NU__Entity__c?: Maybe<string>;
  NU__Event__c?: Maybe<unknown>;
  NU__Event2__c?: Maybe<string>;
  // How the fee for the product is charged
  NU__FeeType__c?: Maybe<string | "Flat Rate">;
  // Total inventory of the product, including products sold
  NU__Inventory__c?: Maybe<number>;
  // Date the inventory fields were last updated
  NU__InventoryLastUpdated__c?: Maybe<string>;
  // Inventory available for purchase
  NU__InventoryOnHand__c?: Maybe<number>;
  NU__InventoryUsed__c?: Maybe<number>;
  NU__IsDownloadable__c?: Maybe<boolean>;
  NU__IsEventBadge__c?: Maybe<boolean>;
  NU__IsFee__c?: Maybe<boolean>;
  NU__IsShippable__c?: Maybe<boolean>;
  NU__IsTaxable__c?: Maybe<false>;
  // Cost of the product, in dollars
  NU__ListPrice__c?: Maybe<number>;
  NU__Publication__c?: Maybe<unknown>;
  NU__QuantityMax__c?: Maybe<number>;
  NU__Rate__c?: Maybe<unknown>;
  NU__RecordTypeName__c?: Maybe<string | "Exhibitor" | "Sponsorship">;
  NU__RecurringEligible__c?: Maybe<boolean>;
  NU__RecurringFrequency__c?: Maybe<unknown>;
  NU__RegistrationTypes__c?: Maybe<unknown>;
  NU__RevenueGLAccount__c?: Maybe<string>;
  NU__SelfServiceEnabled__c?: Maybe<boolean>;
  //
  NU__ShortDescription__c?: Maybe<string>;
  NU__ShortName__c?: Maybe<string>;
  NU__StartDate__c?: Maybe<unknown>;
  NU__Status__c?: Maybe<string | "Active">;
  NU__SubscriptionAnnualStartMonth__c?: Maybe<string>;
  NU__SubscriptionGracePeriod__c?: Maybe<unknown>;
  NU__SubscriptionRenewalType__c?: Maybe<string | "Anniversary">;
  NU__SubscriptionStartDateControl__c?: Maybe<string>;
  NU__SubscriptionTerm__c?: Maybe<unknown>;
  NU__SuggestedDonationAmounts__c?: Maybe<unknown>;
  NU__TaxCode__c?: Maybe<unknown>;
  NU__TrackInventory__c?: Maybe<boolean>;
  NU__UnitOfMeasurement__c?: Maybe<unknown>;
  NU__UrlParameterName__c?: Maybe<string>;
  // URL for the product image
  NU__WebProductImageURL__c?: Maybe<string>;
  NU__WeightInPounds__c?: Maybe<number>;
  Product_Zone__c?: Maybe<string | "Standard Zone">;
  PromotionalURL__c?: Maybe<string>;
  RecordTypeId?: Maybe<string>;
  // Indicator of whether there are special prices available for the product
  Special_Prices__c?: Maybe<boolean>;
  // Nimble url where the product can be purchased
  Store_URL__c?: Maybe<string>;
  Thank_You_Message__c?: Maybe<unknown>;
  TieredPricingAccountField__c?: Maybe<unknown>;
  TieredPricingAPIName__c?: Maybe<unknown>;
  TieredPricingDecimalPlaces__c?: Maybe<unknown>;
  TieredPricingFormula__c?: Maybe<string | "Straight">;
  TieredPricingRoundingMode__c?: Maybe<unknown>;
  Type__c?: Maybe<unknown>;
};

type LimitedNimbleProduct<FS extends ReadonlyArray<keyof NimbleProduct>> = Pick<
  NimbleProduct,
  FS[number]
>;
