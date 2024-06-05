import { Injectable } from '@angular/core';
import {
  NoPreloading,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CompanyService } from './service/company/company.service';
import { Storage } from '@ionic/storage-angular';
import { MenuController, NavController, Platform } from '@ionic/angular';
interface DeeplinkMatch {
  $stoneName: string;
  $refKgCompanyId: number;
}

@Injectable({
  providedIn: 'root',
})
export class DefauultRouteService {
  branchData: DeeplinkMatch;

  constructor(
    private platform: Platform,
    private router: Router,
    public storage: Storage,
    private _companyService: CompanyService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    return this._companyService
      .dfHomePage()
      .then((res) => {
        if (res) {
          this.router.navigateByUrl(res);
          return false; // Prevent navigation since we've redirected
        } else {
          return true; // Allow navigation
        }
      })
      .catch((error) => {
        console.error('Error occurred:', error);
        return false; // Handle error and prevent navigation
      });
  }
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'home/:id',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'collections/:id',
    pathMatch: 'prefix',
    loadChildren: () =>
      import('./pages/collections/collections.module').then(
        (m) => m.CollectionsPageModule
      ),
  },
  {
    path: 'collections/:id/:category',
    pathMatch: 'prefix',
    loadChildren: () =>
      import('./pages/collections/collections.module').then(
        (m) => m.CollectionsPageModule
      ),
  },
  {
    path: 'my-addresses',
    loadChildren: () =>
      import('./pages/my-addresses/my-addresses.module').then(
        (m) => m.MyAddressesPageModule
      ),
  },
  {
    path: 'add-new-address',
    loadChildren: () =>
      import('./pages/add-new-address/add-new-address.module').then(
        (m) => m.AddNewAddressPageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'products/:id/:title/:location',
    loadChildren: () =>
      import('./pages/products/products.module').then(
        (m) => m.ProductsPageModule
      ),
  },
  {
    path: 'products/:id/:title',
    loadChildren: () =>
      import('./pages/products/products.module').then(
        (m) => m.ProductsPageModule
      ),
  },
  {
    path: 'products/:id',
    loadChildren: () =>
      import('./pages/products/products.module').then(
        (m) => m.ProductsPageModule
      ),
  },
  {
    path: 'reportNo/:reportNo',
    loadChildren: () =>
      import('./pages/products/products.module').then(
        (m) => m.ProductsPageModule
      ),
  },
  {
    path: 'orders/:status',
    loadChildren: () =>
      import('./pages/orders/orders.module').then((m) => m.OrdersPageModule),
  },
  {
    path: 'my-favorite',
    loadChildren: () =>
      import('./pages/my-favorite/my-favorite.module').then(
        (m) => m.MyFavoritePageModule
      ),
  },
  {
    path: 'setting',
    loadChildren: () =>
      import('./pages/setting/setting.module').then((m) => m.SettingPageModule),
  },
  {
    path: 'profile-update',
    loadChildren: () =>
      import('./pages/profile-update/profile-update.module').then(
        (m) => m.ProfileUpdatePageModule
      ),
  },
  {
    path: 'manage-orders',
    loadChildren: () =>
      import('./pages/manage-orders/manage-orders.module').then(
        (m) => m.ManageOrdersPageModule
      ),
  },
  {
    path: 'new-order',
    loadChildren: () =>
      import('./pages/new-order/new-order.module').then(
        (m) => m.NewOrderPageModule
      ),
  },
  {
    path: 'manage-order-details/:id',
    loadChildren: () =>
      import('./pages/manage-order-details/manage-order-details.module').then(
        (m) => m.ManageOrderDetailsPageModule
      ),
  },
  {
    path: 'view-order-details/:publicId',
    loadChildren: () =>
      import('./pages/manage-order-details/manage-order-details.module').then(
        (m) => m.ManageOrderDetailsPageModule
      ),
  },
  {
    path: 'about-us',
    loadChildren: () =>
      import('./pages/about-us/about-us.module').then(
        (m) => m.AboutUsPageModule
      ),
  },
  {
    path: 'page-contents',
    loadChildren: () =>
      import('./pages/page-contents/page-contents.module').then(
        (m) => m.PageContentsPageModule
      ),
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./pages/search/search.module').then((m) => m.SearchPageModule),
  },
  {
    path: 'schemes',
    loadChildren: () =>
      import('./pages/schemes/schemes.module').then((m) => m.SchemesPageModule),
  },
  {
    path: 'dispatchs',
    loadChildren: () =>
      import('./pages/dispatchs/dispatchs.module').then(
        (m) => m.DispatchsPageModule
      ),
  },
  {
    path: 'view-dispatch/:id',
    loadChildren: () =>
      import('./pages/view-dispatch/view-dispatch.module').then(
        (m) => m.ViewDispatchPageModule
      ),
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./pages/notifications/notifications.module').then(
        (m) => m.NotificationsPageModule
      ),
  },
  {
    path: 'order-freshness',
    loadChildren: () =>
      import('./pages/order-freshness/order-freshness.module').then(
        (m) => m.OrderFreshnessPageModule
      ),
  },
  {
    path: 'login-with-sign-up',
    loadChildren: () =>
      import('./pages/login-with-sign-up/login-with-sign-up.module').then(
        (m) => m.LoginWithSignUpPageModule
      ),
  },
  {
    path: 'change-password',
    loadChildren: () =>
      import('./pages/change-password/change-password.module').then(
        (m) => m.ChangePasswordPageModule
      ),
  },
  {
    path: 'product-form',
    loadChildren: () =>
      import('./pages/product-form/product-form.module').then(
        (m) => m.ProductFormPageModule
      ),
  },
  {
    path: 'show-cart/:id',
    loadChildren: () =>
      import('./pages/show-cart/show-cart.module').then(
        (m) => m.ShowCartPageModule
      ),
  },
  {
    path: 'saved-carts',
    loadChildren: () =>
      import('./pages/saved-carts/saved-carts.module').then(
        (m) => m.SavedCartsPageModule
      ),
  },
  {
    path: 'saved-searches',
    loadChildren: () =>
      import('./pages/saved-searches/saved-searches.module').then(
        (m) => m.SavedSearchesPageModule
      ),
  },
  {
    path: 'my-cart',
    loadChildren: () =>
      import('./pages/my-cart/my-cart.module').then((m) => m.MyCartPageModule),
  },
  {
    path: 'diamond-search',
    loadChildren: () =>
      import('./pages/diamond-search/diamond-search.module').then(
        (m) => m.DiamondSearchPageModule
      ),
  },
  // {
  //   path: 'ngx-form',
  //   loadChildren: () =>
  //     import('./pages/ngx-form/ngx-form.module').then(m => m.NgxFormPageModule),
  // },
  {
    path: 'guest-login',
    loadChildren: () =>
      import('./pages/guest-login/guest-login.module').then(
        (m) => m.GuestLoginPageModule
      ),
  },
  {
    path: 'pd-parameters',
    loadChildren: () =>
      import('./pages/pd-parameters/pd-parameters.module').then(
        (m) => m.PdParametersPageModule
      ),
  },
  {
    path: 'my-customers',
    loadChildren: () =>
      import('./pages/my-customers/my-customers.module').then(
        (m) => m.MyCustomersPageModule
      ),
  },
  {
    path: 'general-info',
    loadChildren: () =>
      import('./pages/diamond/profile/general-info/general-info.module').then(
        (m) => m.GeneralInfoPageModule
      ),
  },
  {
    path: 'add-customer',
    loadChildren: () =>
      import('./pages/add-customer/add-customer.module').then(
        (m) => m.AddCustomerPageModule
      ),
  },
  {
    path: 'my-login',
    loadChildren: () =>
      import('./pages/my-login/my-login.module').then(
        (m) => m.MyLoginPageModule
      ),
  },
  {
    path: 'quick-buy',
    loadChildren: () =>
      import('./pages/quick-buy/quick-buy.module').then(
        (m) => m.QuickBuyPageModule
      ),
  },
  // { path: "", canActivate: [DefauultRouteService], loadChildren: () => import("./pages/select-suppliers/select-suppliers.module").then((m) => m.SelectSuppliersPageModule) }
  {
    path: '',
    canActivate: [DefauultRouteService],
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'track-order',
    loadChildren: () =>
      import('./pages/track-order/track-order.module').then(
        (m) => m.TrackOrderPageModule
      ),
  },
  {
    path: 'cart-added-popup',
    loadChildren: () =>
      import('./pages/cart-added-popup/cart-added-popup.module').then(
        (m) => m.CartAddedPopupPageModule
      ),
  },
  {
    path: 'maintenance',
    loadChildren: () =>
      import('./pages/static/static.module').then((m) => m.StaticPageModule),
  },
  // {
  //   path: 'accessories',
  //   loadChildren: () => import('./pages/accessories/accessories.module').then( m => m.AccessoriesPageModule)
  // },
  {
    path: 'delete-account',
    loadChildren: () =>
      import('./pages/delete-account-form/delete-account-form.module').then(
        (m) => m.DeleteAccountFormPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
